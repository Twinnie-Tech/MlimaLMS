export type UploadKind = "image" | "video"

export const uploadRules: Record<UploadKind, { maxBytes: number; types: Record<string, string> }> = {
  image: {
    maxBytes: 5 * 1024 * 1024,
    types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" },
  },
  video: {
    maxBytes: 2 * 1024 * 1024 * 1024,
    types: { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" },
  },
}

export function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`
  if (bytes >= 1024 ** 2) return `${Math.round(bytes / 1024 ** 2)} MB`
  return `${Math.round(bytes / 1024)} KB`
}
