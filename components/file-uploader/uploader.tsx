"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useDropzone, type FileRejection } from "react-dropzone"
import { ImageUp, Loader2, RefreshCw, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "cn"

import { createUploadUrl, deleteUpload } from "@/lib/actions/uploads"
import { formatBytes, uploadRules, type UploadKind } from "@/lib/upload-rules"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type UploaderProps = {
  /** Form field name. The uploaded file's public URL is submitted under this name. */
  name: string
  id?: string
  kind?: UploadKind
  defaultValue?: string
  uploadsEnabled: boolean
  className?: string
}

function putFile(
  url: string,
  file: File,
  onProgress: (percent: number) => void,
  xhrRef: React.RefObject<XMLHttpRequest | null>
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)))
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and the bucket CORS settings."))
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"))
    xhr.send(file)
  })
}

function isImageUrl(value: string) {
  try {
    const { protocol } = new URL(value)
    return protocol === "https:" || protocol === "http:"
  } catch {
    return false
  }
}

function rejectionMessage(rejection: FileRejection, kind: UploadKind) {
  const rules = uploadRules[kind]
  const code = rejection.errors[0]?.code
  if (code === "file-too-large") return `File is too large. Maximum size is ${formatBytes(rules.maxBytes)}.`
  if (code === "file-invalid-type") return `Unsupported file type. Use ${Object.values(rules.types).join(", ")}.`
  if (code === "too-many-files") return "Drop one file at a time."
  return rejection.errors[0]?.message ?? "This file cannot be uploaded."
}

export function Uploader({
  name,
  id,
  kind = "image",
  defaultValue = "",
  uploadsEnabled,
  className,
}: UploaderProps) {
  const rules = uploadRules[kind]
  const [url, setUrl] = useState(defaultValue)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [brokenUrl, setBrokenUrl] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [removing, setRemoving] = useState(false)
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const uploading = progress !== null
  const shownImage = preview ?? (isImageUrl(url) && !brokenUrl ? url : null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  async function upload(file: File) {
    setPreview(URL.createObjectURL(file))
    setProgress(0)
    try {
      const target = await createUploadUrl(kind, { type: file.type, size: file.size })
      if ("error" in target) throw new Error(target.error)
      await putFile(target.uploadUrl, file, setProgress, xhrRef)
      setUrl(target.publicUrl)
      setBrokenUrl(false)
      toast.success(`${file.name} uploaded. Save to keep it.`)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      xhrRef.current = null
      setProgress(null)
      setPreview(null)
    }
  }

  async function removeFile() {
    setRemoving(true)
    try {
      const result = await deleteUpload(url)
      if ("error" in result) {
        toast.error(result.error)
        return
      }
      setUrl("")
      setBrokenUrl(false)
      setConfirmOpen(false)
      toast.success("File removed successfully")
    } catch {
      toast.error("Could not remove the file. Please try again.")
    } finally {
      setRemoving(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    accept: Object.fromEntries(
      Object.entries(rules.types).map(([mime, ext]) => [mime, ext === "jpg" ? [".jpg", ".jpeg"] : [`.${ext}`]])
    ),
    maxSize: rules.maxBytes,
    maxFiles: 1,
    multiple: false,
    disabled: !uploadsEnabled || uploading,
    noClick: Boolean(shownImage),
    noKeyboard: Boolean(shownImage),
    onDropAccepted: ([file]) => upload(file),
    onDropRejected: ([rejection]) => toast.error(rejectionMessage(rejection, kind)),
  })

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        {...getRootProps({
          className: cn(
            "group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-input bg-muted/30 text-center transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            uploadsEnabled && !shownImage && "cursor-pointer hover:border-primary/60 hover:bg-muted/50",
            isDragActive && "border-primary bg-primary/5",
            isDragReject && "border-destructive bg-destructive/5",
            !uploadsEnabled && !shownImage && "cursor-not-allowed opacity-70"
          ),
        })}
      >
        <input {...getInputProps({ id })} />

        {shownImage ? (
          <>
            <Image
              src={shownImage}
              alt="Cover preview"
              fill
              unoptimized
              sizes="(min-width: 768px) 640px, 100vw"
              className={cn("object-cover", uploading && "opacity-50")}
              onError={() => !preview && setBrokenUrl(true)}
            />
            {uploading ? (
              <div className="absolute inset-x-6 bottom-6 flex flex-col gap-2 rounded-lg bg-background/90 p-3 shadow-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Uploading {progress}%
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={(event) => {
                      event.stopPropagation()
                      xhrRef.current?.abort()
                    }}
                  >
                    <X /> Cancel
                  </Button>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-green-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="absolute right-3 bottom-3 flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                {uploadsEnabled && (
                  <Button type="button" size="sm" variant="secondary" onClick={open}>
                    <RefreshCw /> Replace
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={removing}
                  onClick={() => setConfirmOpen(true)}
                >
                  {removing ? <Loader2 className="animate-spin" /> : <Trash2 />}
                  {removing ? "Removing..." : "Remove"}
                </Button>
              </div>
            )}
            {isDragActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-sm font-medium">
                Drop to replace the image
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
              <ImageUp className="size-6 text-muted-foreground" />
            </div>
            {uploadsEnabled ? (
              <>
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop the image here" : "Drag and drop an image, or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(rules.types).join(", ").toUpperCase()} up to {formatBytes(rules.maxBytes)}.
                  A 16:9 image looks best.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">Image uploads are not set up yet</p>
                <p className="text-xs text-muted-foreground">
                  Paste a link below, or leave it empty to use a coloured cover for your category.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id ?? name}-url`} className="text-xs text-muted-foreground">
          Or paste an image link
        </label>
        <Input
          id={`${id ?? name}-url`}
          type="url"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
            setBrokenUrl(false)
          }}
          placeholder="https://..."
          disabled={uploading}
        />
      </div>

      <input type="hidden" name={name} value={url} />

      <AlertDialog open={confirmOpen} onOpenChange={(open) => !removing && setConfirmOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this {kind}?</AlertDialogTitle>
            <AlertDialogDescription>
              Files you uploaded are permanently deleted from storage. Courses using it will show the
              coloured category cover instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={removing} onClick={removeFile}>
              {removing && <Loader2 className="animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
