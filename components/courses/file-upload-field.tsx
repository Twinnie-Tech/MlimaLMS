"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

import { createUploadUrl } from "@/lib/actions/uploads"
import { formatBytes, uploadRules, type UploadKind } from "@/lib/upload-rules"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function putFile(url: string, file: File, onProgress: (percent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)))
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and the bucket CORS settings."))
    xhr.send(file)
  })
}

export function FileUploadField({
  id,
  name,
  kind,
  defaultValue,
  placeholder,
  uploadsEnabled,
}: {
  id: string
  name: string
  kind: UploadKind
  defaultValue?: string
  placeholder?: string
  uploadsEnabled: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [uploadedName, setUploadedName] = useState<string | null>(null)
  const rules = uploadRules[kind]

  useEffect(() => {
    const form = inputRef.current?.form
    if (!form) return
    const onReset = () => setUploadedName(null)
    form.addEventListener("reset", onReset)
    return () => form.removeEventListener("reset", onReset)
  }, [])

  async function handleFile(file: File) {
    setUploadedName(null)
    setProgress(0)
    try {
      const target = await createUploadUrl(kind, { type: file.type, size: file.size })
      if ("error" in target) throw new Error(target.error)
      await putFile(target.uploadUrl, file, setProgress)
      if (inputRef.current) inputRef.current.value = target.publicUrl
      setUploadedName(file.name)
      toast.success(`${file.name} uploaded`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setProgress(null)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const uploading = progress !== null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type="url"
          defaultValue={defaultValue}
          placeholder={placeholder}
          readOnly={uploading}
          onChange={() => setUploadedName(null)}
        />
        {uploadsEnabled && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept={Object.keys(rules.types).join(",")}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
              {uploading ? `${progress}%` : "Upload"}
            </Button>
          </>
        )}
      </div>
      {uploading && (
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-green-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {uploadedName && (
        <p className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-3.5" />
          {uploadedName} is ready. Save to keep it.
          <button
            type="button"
            className="ml-1 text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = ""
              setUploadedName(null)
            }}
          >
            <X className="size-3.5" />
            <span className="sr-only">Remove</span>
          </button>
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        {uploadsEnabled
          ? `Upload a ${Object.values(rules.types).join(", ")} file up to ${formatBytes(rules.maxBytes)}, or paste a link.`
          : kind === "video"
            ? "Paste a YouTube, Vimeo or direct .mp4 link. File uploads are coming soon."
            : "Paste a link to an image. Leave empty to use a coloured cover for your category."}
      </p>
    </div>
  )
}
