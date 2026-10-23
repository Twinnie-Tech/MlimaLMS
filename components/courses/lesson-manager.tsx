"use client"

import { useActionState, useEffect, useRef, useTransition } from "react"
import { Eye, FileText, Loader2, Plus, Trash2, Video } from "lucide-react"
import { toast } from "sonner"

import { addLesson, deleteLesson, type FormState } from "@/lib/actions/courses"
import { formatDuration } from "@/lib/course-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUploadField } from "@/components/courses/file-upload-field"

type Lesson = {
  id: string
  title: string
  duration: number
  videoUrl: string | null
  isFreePreview: boolean
}

function DeleteLessonButton({ lessonId }: { lessonId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteLesson(lessonId)
          toast.success("Lesson deleted")
        })
      }
    >
      {pending ? <Loader2 className="animate-spin" /> : <Trash2 className="text-destructive" />}
      <span className="sr-only">Delete lesson</span>
    </Button>
  )
}

export function LessonManager({
  courseId,
  lessons,
  uploadsEnabled = false,
}: {
  courseId: string
  lessons: Lesson[]
  uploadsEnabled?: boolean
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addLesson.bind(null, courseId),
    undefined
  )

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) {
      toast.success(state.success)
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className="flex flex-col gap-6">
      {lessons.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No lessons yet. Add your first lesson below.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {lessons.map((lesson, i) => (
            <li key={lesson.id} className="flex items-center gap-3 rounded-lg border bg-background p-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-sm font-semibold text-green-700 dark:text-green-400">
                {i + 1}
              </span>
              {lesson.videoUrl ? (
                <Video className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{lesson.title}</span>
              {lesson.isFreePreview && (
                <Badge variant="secondary">
                  <Eye />
                  Preview
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{formatDuration(lesson.duration)}</span>
              <DeleteLessonButton lessonId={lesson.id} />
            </li>
          ))}
        </ol>
      )}

      <form ref={formRef} action={formAction} className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-5">
        <p className="font-medium">Add a lesson</p>
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lesson-title">Lesson title</Label>
            <Input id="lesson-title" name="title" placeholder="e.g. Recording sales and expenses" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lesson-duration">Minutes</Label>
            <Input id="lesson-duration" name="duration" type="number" min={0} defaultValue={10} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lesson-video">Video</Label>
          <FileUploadField
            id="lesson-video"
            name="videoUrl"
            kind="video"
            placeholder="YouTube, Vimeo or a direct .mp4 link"
            uploadsEnabled={uploadsEnabled}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lesson-content">Notes and written content</Label>
          <Textarea
            id="lesson-content"
            name="content"
            rows={4}
            placeholder="Lesson notes, steps, links to resources or an article for this lesson"
          />
        </div>
        <label htmlFor="lesson-preview" className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox id="lesson-preview" name="isFreePreview" />
          Free preview (anyone can watch this lesson before enrolling)
        </label>
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? <Loader2 className="animate-spin" /> : <Plus />}
          {pending ? "Adding..." : "Add lesson"}
        </Button>
      </form>
    </div>
  )
}
