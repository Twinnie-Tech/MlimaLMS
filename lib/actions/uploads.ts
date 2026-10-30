"use server"

import { revalidatePath } from "next/cache"

import { protectAction } from "@/lib/arcjet"
import { prisma } from "@/lib/db"
import {
  createPresignedUpload,
  deleteUploadKey,
  isOwnUpload,
  isS3Configured,
  uploadKeyFromUrl,
} from "@/lib/s3"
import { requireUser } from "@/lib/session"
import { formatBytes, uploadRules, type UploadKind } from "@/lib/upload-rules"

export type UploadTarget = { error: string } | { uploadUrl: string; publicUrl: string }

export type DeleteUploadResult = { error: string } | { deleted: boolean }

export async function createUploadUrl(
  kind: UploadKind,
  file: { type: string; size: number }
): Promise<UploadTarget> {
  const user = await requireUser()
  if (!isS3Configured()) return { error: "File uploads are not set up yet. Paste a link instead." }
  const blocked = await protectAction(user.id, "upload")
  if (blocked) return { error: blocked }

  const rules = uploadRules[kind]
  if (!rules) return { error: "Unsupported upload type" }
  if (!rules.types[file.type]) {
    return { error: `Unsupported file type. Allowed: ${Object.values(rules.types).join(", ")}` }
  }
  if (!Number.isInteger(file.size) || file.size <= 0) return { error: "This file is empty" }
  if (file.size > rules.maxBytes) {
    return { error: `File is too large. Maximum size is ${formatBytes(rules.maxBytes)}` }
  }

  const { uploadUrl, publicUrl } = await createPresignedUpload({
    kind,
    contentType: file.type,
    contentLength: file.size,
    userId: user.id,
  })
  return { uploadUrl, publicUrl }
}

/**
 * Deletes a file the user uploaded and clears any saved course cover or lesson
 * video that points to it. Links hosted elsewhere are left alone (`deleted: false`).
 */
export async function deleteUpload(url: string): Promise<DeleteUploadResult> {
  const user = await requireUser()
  const key = typeof url === "string" ? uploadKeyFromUrl(url) : null
  if (!key) return { deleted: false }
  if (!isOwnUpload(key, user.id)) return { error: "You can only delete files you uploaded." }

  const blocked = await protectAction(user.id, "update")
  if (blocked) return { error: blocked }

  try {
    await deleteUploadKey(key)
  } catch (error) {
    console.error("Failed to delete S3 object", error)
    return { error: "Could not delete the file. Please try again." }
  }

  const [courses, lessons] = await Promise.all([
    prisma.course.updateMany({
      where: { instructorId: user.id, imageUrl: url },
      data: { imageUrl: null },
    }),
    prisma.lesson.updateMany({
      where: { videoUrl: url, course: { instructorId: user.id } },
      data: { videoUrl: null },
    }),
  ])
  if (courses.count || lessons.count) {
    revalidatePath("/explore", "layout")
    revalidatePath("/instructor", "layout")
    revalidatePath("/learn", "layout")
  }

  return { deleted: true }
}
