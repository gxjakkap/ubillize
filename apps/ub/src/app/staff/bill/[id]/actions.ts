'use server'

import { auth } from "@/auth"
import { StaffAppRoles } from "@/lib/const"
import { checkRoles } from "@/lib/roles"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { db } from "@ubillize/db"
import { eq } from "@ubillize/db/orm"
import { bills, tasks } from "@ubillize/db/schema"

const S3 = new S3Client({
    region: "auto",
    endpoint: `${process.env.S3_URL}`,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
})

export async function getSlipPresignedURL(imgKey: string) {
    const session = await auth()
    if (!session || !checkRoles(session.user.role, StaffAppRoles)) return ''
    console.log(imgKey)
    const url = await getSignedUrl(
        S3,
        new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: `${imgKey}` }),
        { expiresIn: 3600 },
    )
    return url
}

export async function archiveBill(id: number, current: boolean) {
    const session = await auth()
    if (!session || !checkRoles(session.user.role, StaffAppRoles)){
        return { status: 403 }
    }
    await db.update(bills).set({ archiveStatus: !current, archiveDate: (current ? null : new Date()) }).where(eq(bills.id, id))
    return { status: 200 }
}

export async function cancelBill(id: number, roomNo: string) {
    const session = await auth()
    if (!session || !checkRoles(session.user.role, StaffAppRoles)){
        return { status: 403 }
    }
    await db.delete(bills).where(eq(bills.id, id))
    await db.insert(tasks).values({ type: 'bill_canceled', to: roomNo, ref: id.toString() })
    return { status: 200 }
}