"use client"

import { useTransition } from "react"
import { EyeOff, Loader2, Rocket, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { deleteCourse, togglePublish } from "@/lib/actions/courses"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function PublishButton({ courseId, published }: { courseId: string; published: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      disabled={pending}
      variant={published ? "outline" : "default"}
      className={published ? undefined : "bg-green-600 text-white hover:bg-green-700"}
      onClick={() =>
        startTransition(async () => {
          const result = await togglePublish(courseId)
          if (result?.error) toast.error(result.error)
          if (result?.success) toast.success(result.success)
        })
      }
    >
      {pending ? <Loader2 className="animate-spin" /> : published ? <EyeOff /> : <Rocket />}
      {published ? "Unpublish" : "Publish course"}
    </Button>
  )
}

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" className="text-destructive" />}>
        <Trash2 />
        Delete course
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this course?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the course, its lessons and all student enrollments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={() => startTransition(() => deleteCourse(courseId))}
          >
            {pending && <Loader2 className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
