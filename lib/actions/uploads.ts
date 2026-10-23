"use server"

import { createPresignedUpload, isS3Configured } from "@/lib/s3"
import { requireUser } from "@/lib/session"
import { formatBytes, uploadRules, type UploadKind } from "@/lib/upload-rules"

export type UploadTarget = { error: string } | { uploadUrl: string; publicUrl: string }

export async function createUploadUrl(
  kind: UploadKind,
  file: { type: string; size: number }
): Promise<UploadTarget> {
  const user = await requireUser()
  if (!isS3Configured()) return { error: "File uploads are not set up yet. Paste a link instead." }

  const rules = uploadRules[kind]
  if (!rules) return { error: "Unsupported upload type" }
  if (!rules.types[file.type]) {
    return { error: `Unsupported file type. Allowed: ${Object.values(rules.types).join(", ")}` }
  }
  if (file.size > rules.maxBytes) {
    return { error: `File is too large. Maximum size is ${formatBytes(rules.maxBytes)}` }
  }

  const { uploadUrl, publicUrl } = await createPresignedUpload({
    kind,
    contentType: file.type,
    userId: user.id,
  })
  return { uploadUrl, publicUrl }
}
