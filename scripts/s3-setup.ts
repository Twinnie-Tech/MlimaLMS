/**
 * Creates and configures the S3 bucket used for course cover images and videos,
 * then checks that a presigned upload and a public read both work.
 *
 *   pnpm s3:setup   create or update the bucket, then run the checks
 *   pnpm s3:check   only run the checks
 *
 * Reads AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET and
 * AWS_S3_PUBLIC_URL from .env. Extra browser origins for CORS can be passed in
 * S3_CORS_ORIGINS as a comma separated list.
 */
import "dotenv/config"
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
  type BucketLocationConstraint,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const required = ["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_S3_BUCKET"] as const
const missing = required.filter((key) => !process.env[key]?.trim())
if (missing.length) {
  console.error(`Missing in .env: ${missing.join(", ")}. See docs/s3-setup.md.`)
  process.exit(1)
}

const region = process.env.AWS_REGION!.trim()
const bucket = process.env.AWS_S3_BUCKET!.trim()
const publicBaseUrl = (process.env.AWS_S3_PUBLIC_URL?.trim() || `https://${bucket}.s3.${region}.amazonaws.com`).replace(/\/$/, "")
const checkOnly = process.argv.includes("--check")

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!.trim(),
  },
})

function corsOrigins() {
  const origins = new Set(["http://localhost:3000"])
  const appUrl = process.env.BETTER_AUTH_URL?.trim()
  if (appUrl) origins.add(new URL(appUrl).origin)
  for (const origin of process.env.S3_CORS_ORIGINS?.split(",") ?? []) {
    if (origin.trim()) origins.add(new URL(origin.trim()).origin)
  }
  return [...origins]
}

function step(message: string) {
  console.log(`\n• ${message}`)
}

function explain(error: unknown) {
  if (error instanceof S3ServiceException) {
    if (error.name === "AccessDenied") {
      return "Access denied. Give the IAM user the setup policy in docs/s3-setup.md."
    }
    if (error.name === "InvalidAccessKeyId" || error.name === "SignatureDoesNotMatch") {
      return "The access key ID or secret in .env is wrong."
    }
    if (error.name === "BucketAlreadyExists") {
      return `The name "${bucket}" is taken by another AWS account. Bucket names are global, pick another one.`
    }
    if (error.name === "IllegalLocationConstraintException" || error.name === "InvalidLocationConstraint") {
      return `Region ${region} is not enabled for this account. Enable it in the AWS console or use another region.`
    }
    return `${error.name}: ${error.message}`
  }
  return error instanceof Error ? error.message : String(error)
}

async function bucketExists() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }))
    return true
  } catch (error) {
    if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) return false
    throw error
  }
}

async function setup() {
  step(`Bucket ${bucket} in ${region}`)
  if (await bucketExists()) {
    console.log("  already exists")
  } else {
    await s3.send(
      new CreateBucketCommand({
        Bucket: bucket,
        ...(region === "us-east-1"
          ? {}
          : { CreateBucketConfiguration: { LocationConstraint: region as BucketLocationConstraint } }),
      })
    )
    console.log("  created")
  }

  step("Public access settings")
  await s3.send(
    new PutPublicAccessBlockCommand({
      Bucket: bucket,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        IgnorePublicAcls: true,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    })
  )
  console.log("  ACLs stay blocked, a bucket policy may allow public reads")

  step("Bucket policy: public read for uploads/*")
  await s3.send(
    new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "PublicReadUploads",
            Effect: "Allow",
            Principal: "*",
            Action: "s3:GetObject",
            Resource: `arn:aws:s3:::${bucket}/uploads/*`,
          },
        ],
      }),
    })
  )
  console.log("  applied")

  const origins = corsOrigins()
  step("CORS for browser uploads")
  await s3.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: origins,
            AllowedMethods: ["PUT", "GET", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    })
  )
  console.log(`  allowed origins: ${origins.join(", ")}`)
}

async function check() {
  const key = `uploads/_healthcheck/${Date.now()}.txt`

  step("Presigned upload, the same way the browser does it")
  const body = "MlimaLMS S3 check"
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: "text/plain",
      ContentLength: Buffer.byteLength(body),
    }),
    { expiresIn: 60, signableHeaders: new Set(["content-type", "content-length"]) }
  )
  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "text/plain" },
    body,
  })
  if (!put.ok) throw new Error(`Upload failed with ${put.status}: ${await put.text()}`)
  console.log("  ok")

  step(`Public read from ${publicBaseUrl}`)
  const get = await fetch(`${publicBaseUrl}/${key}`)
  if (!get.ok) {
    throw new Error(
      `Reading the file returned ${get.status}. Check the bucket policy, or AWS_S3_PUBLIC_URL if you use CloudFront.`
    )
  }
  console.log("  ok")

  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}

async function main() {
  if (!checkOnly) await setup()
  await check()
  console.log("\n✓ S3 is ready. Restart `pnpm dev` and the cover image drop zone will accept files.")
}

main().catch((error) => {
  console.error(`\n✗ ${explain(error)}`)
  process.exit(1)
})
