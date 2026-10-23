"use client"

import { useTransition } from "react"
import { Loader2, PlayCircle } from "lucide-react"
import { toast } from "sonner"

import { enrollInCourse } from "@/lib/actions/courses"
import { formatPrice } from "@/lib/course-utils"
import { Button } from "@/components/ui/button"

export function EnrollButton({ courseId, price }: { courseId: string; price: number }) {
  const [pending, startTransition] = useTransition()

  function enroll() {
    startTransition(async () => {
      const result = await enrollInCourse(courseId)
      if (result?.error) toast.error(result.error)
    })
  }

  return (
    <Button
      size="lg"
      onClick={enroll}
      disabled={pending}
      className="w-full bg-green-600 text-white hover:bg-green-700"
    >
      {pending ? <Loader2 className="animate-spin" /> : <PlayCircle />}
      {pending ? "Enrolling..." : price === 0 ? "Enroll for free" : `Enroll · ${formatPrice(price)}`}
    </Button>
  )
}
