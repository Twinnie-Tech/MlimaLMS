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
  contentLength,
  userId,
}: {
  kind: UploadKind
  contentType: string
  contentLength: number
  userId: string
}) {
  const extension = uploadRules[kind].types[contentType]
  const key = `uploads/${userId}/${kind}s/${randomUUID()}.${extension}`

  const uploadUrl = await getSignedUrl(
    getClient(),
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLength,
    }),
    { expiresIn: 60 * 10, signableHeaders: new Set(["content-type", "content-length"]) }
  )

  return { uploadUrl, publicUrl: `${publicBaseUrl()}/${key}`, key }
}

/** The object key for a URL in our bucket, or null for links hosted elsewhere. */
export function uploadKeyFromUrl(url: string) {
  if (!isS3Configured()) return null
  const prefix = `${publicBaseUrl()}/`
  if (!url.startsWith(prefix)) return null
  const key = decodeURIComponent(url.slice(prefix.length).split(/[?#]/)[0])
  return key.startsWith("uploads/") && !key.includes("..") ? key : null
}

export function isOwnUpload(key: string, userId: string) {
  return key.startsWith(`uploads/${userId}/`)
}

/** Deletes an object and throws if S3 refuses. */
export async function deleteUploadKey(key: string) {
  await getClient().send(new DeleteObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key }))
}

export async function deleteUploadedFile(url: string | null | undefined) {
  const key = url ? uploadKeyFromUrl(url) : null
  if (!key) return

  try {
    await deleteUploadKey(key)
  } catch (error) {
    console.error("Failed to delete S3 object", error)
  }
}
