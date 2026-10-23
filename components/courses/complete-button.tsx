"use client"

import { useTransition } from "react"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { toggleLessonComplete } from "@/lib/actions/courses"
import { Button } from "@/components/ui/button"

export function CompleteButton({ lessonId, completed }: { lessonId: string; completed: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant={completed ? "outline" : "default"}
      disabled={pending}
      className={completed ? "text-green-600" : "bg-green-600 text-white hover:bg-green-700"}
      onClick={() =>
        startTransition(async () => {
          const done = await toggleLessonComplete(lessonId)
          if (done) toast.success("Lesson completed. Keep going! 🎉")
        })
      }
    >
      {pending ? <Loader2 className="animate-spin" /> : completed ? <CheckCircle2 /> : <Circle />}
      {completed ? "Completed" : "Mark as complete"}
    </Button>
  )
}
