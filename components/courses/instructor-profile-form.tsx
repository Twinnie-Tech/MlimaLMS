"use client"

import { useActionState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { updateInstructorProfile } from "@/lib/actions/courses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function InstructorProfileForm({
  headline,
  bio,
}: {
  headline: string | null
  bio: string | null
}) {
  const [state, formAction, pending] = useActionState(updateInstructorProfile, undefined)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) toast.success(state.success)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          name="headline"
          defaultValue={headline ?? ""}
          placeholder="e.g. Certified Public Accountant (CPA-K)"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">About you</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={5}
          defaultValue={bio ?? ""}
          placeholder="Your experience, where you work and why you love teaching this subject"
        />
      </div>
      <Button type="submit" disabled={pending} variant="outline" className="w-fit">
        {pending ? <Loader2 className="animate-spin" /> : <Save />}
        {pending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  )
}
