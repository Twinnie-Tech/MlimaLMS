import { randomUUID } from "node:crypto"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { env } from "@/lib/env"
import { uploadRules, type UploadKind } from "@/lib/upload-rules"

export function isS3Configured() {
  return Boolean(env.AWS_REGION && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET)
}

let client: S3Client | undefined

function getClient() {
  if (!isS3Configured()) throw new Error("S3 storage is not configured")
  client ??= new S3Client({
    region: env.AWS_REGION,
    credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID!, secretAccessKey: env.AWS_SECRET_ACCESS_KEY! },
  })
  return client
}

function publicBaseUrl() {
  return (env.AWS_S3_PUBLIC_URL ?? `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com`).replace(
    /\/$/,
    ""
  )
}

export async function createPresignedUpload({
  kind,
  contentType,
  userId,
}: {
  kind: UploadKind
  contentType: string
  userId: string
}) {
  const extension = uploadRules[kind].types[contentType]
  const key = `uploads/${userId}/${kind}s/${randomUUID()}.${extension}`

  const uploadUrl = await getSignedUrl(
    getClient(),
    new PutObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 60 * 10 }
  )

  return { uploadUrl, publicUrl: `${publicBaseUrl()}/${key}`, key }
}

export async function deleteUploadedFile(url: string | null | undefined) {
  if (!url || !isS3Configured()) return
  const prefix = `${publicBaseUrl()}/`
  if (!url.startsWith(prefix)) return

  try {
    await getClient().send(
      new DeleteObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: url.slice(prefix.length) })
    )
  } catch (error) {
    console.error("Failed to delete S3 object", error)
  }
}
