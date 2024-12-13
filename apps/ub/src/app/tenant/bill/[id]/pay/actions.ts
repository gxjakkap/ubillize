/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { db } from "@ubillize/db"
import { bills, settings, tasks, tenant } from "@ubillize/db/schema"
import { and, eq, or } from "@ubillize/db/orm"
import jsQR from "jsqr"
import { Jimp } from 'jimp'

import { BankShortDict, TenantAppRoles } from "@/lib/const"
import { slipVerify, SlipVerifyError } from "@/lib/slipverify"
import { SlipUploadActionRes, SlipUploadActionError } from "./types"
import { auth } from "@/auth"
import { checkRoles } from "@/lib/roles"


export async function slipUploadAction (file: File, billId: number, tenantId: string): Promise<SlipUploadActionRes>{
    const session = await auth()
    if (!session || !checkRoles(session.user.role, TenantAppRoles)){
        return { status: 403, err: SlipUploadActionError.ForbiddenError }
    }
    const [tenantObj] = await db.select().from(tenant).where(eq(tenant.id, tenantId)).limit(1)
    const [billObj] = await db.select().from(bills).where(and(eq(bills.id, billId), eq(bills.roomNo, tenantObj.roomNo!))).limit(1)
    /* const bankDetails = await db.select().from(settings).where(or(eq(settings.key, 'receivingBankAccNum'), eq(settings.key, 'receivingBankId')))

    const [{ val: rBankId }] = bankDetails.filter((d) => d.key === 'receivingBankId')
    const [{ val: rBankAcc}] = bankDetails.filter((d) => d.key === 'receivingBankAccNum') */

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const image = await Jimp.read(fileBuffer)
    const { data: imageData, width: imageWidth, height: imageHeight } = image.bitmap
    const qrRes = jsQR(new Uint8ClampedArray(imageData), imageWidth, imageHeight)

    if (!qrRes){
        return { status: 400, err: SlipUploadActionError.InvalidSlip }
    }

    const refNbr = qrRes.data
    const slipVerifyResult = await slipVerify(refNbr, billObj.totalDueAmount)

    if (!slipVerifyResult.success){
        if (slipVerifyResult.err === SlipVerifyError.InvalidSlipOrQr) 
            return { status: 400, err: SlipUploadActionError.InvalidSlip }
        else if (slipVerifyResult.err === SlipVerifyError.RateLimitError) 
            return { status: 429, err: SlipUploadActionError.OSVRateLimited }
        else 
            return { status: 500, err: SlipUploadActionError.UnknownError }
    }

    const x: Partial<typeof bills.$inferSelect> = {
        paid: true,
        paidDate: new Date(Date.now()),
        payer: `[${BankShortDict[slipVerifyResult.data?.sendingBank || '']}] ${slipVerifyResult.data?.sender.name}`,
        osvData: slipVerifyResult.data
    }

    const S3 = new S3Client({
        region: "auto",
        endpoint: `${process.env.S3_URL}`,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
    })

    const bucketName = process.env.S3_BUCKET!

    const fileExt = file.name.split('.').pop()
    const uuid = crypto.randomUUID()
    const fileKey = `slips/${billObj.id}-${tenantObj.id}-${uuid}.${fileExt}`

    try {
        const putCmd = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: file.type
        })
        const s3PutRes = await S3.send(putCmd)
        console.log("S3PutResult: ", s3PutRes)
    }
    catch (err){
        console.error('slipUploadError: ', err)
        await db.update(bills).set(x).where(eq(bills.id, billObj.id))
        return { status: 500, err: SlipUploadActionError.SlipUploadError }
    }
    x.slip = fileKey
    await db.update(bills).set(x).where(eq(bills.id, billObj.id))
    
    // schedule a task to notify user that the bill is paid
    await db.insert(tasks).values({ type: 'bill_paid', to: billObj.roomNo, ref: billObj.id.toString() })
    return { status: 201 }
}