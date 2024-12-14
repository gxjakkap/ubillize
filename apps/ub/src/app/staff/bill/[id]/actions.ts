'use server'

import { auth } from "@/auth"
import { StaffAppRoles } from "@/lib/const"
import { checkRoles } from "@/lib/roles"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

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