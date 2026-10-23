"use client"

import { useActionState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import type { FormState } from "@/lib/actions/courses"
import { levelLabels } from "@/lib/course-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUploadField } from "@/components/courses/file-upload-field"

export const selectClassName =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

type CourseValues = {
  title: string
  subtitle: string | null
  description: string
  categoryId: string
  level: keyof typeof levelLabels
  language: string
  price: number
  imageUrl: string | null
}

export function CourseForm({
  action,
  categories,
  course,
  submitLabel = "Create course",
  uploadsEnabled = false,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>
  categories: { id: string; name: string; icon: string }[]
  course?: CourseValues
  submitLabel?: string
  uploadsEnabled?: boolean
}) {
  const [state, formAction, pending] = useActionState(action, undefined)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) toast.success(state.success)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Course title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={course?.title}
          placeholder="e.g. Bookkeeping for Small Businesses"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          defaultValue={course?.subtitle ?? ""}
          placeholder="One sentence that tells students what they will achieve"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={course?.description}
          placeholder="What will students learn? Who is this course for? What do they need before starting?"
          required
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={course?.categoryId ?? ""}
            className={selectClassName}
            required
          >
            <option value="" disabled>
              Choose a field
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            name="level"
            defaultValue={course?.level ?? "ALL_LEVELS"}
            className={selectClassName}
          >
            {Object.entries(levelLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price (KSh)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step={50}
            defaultValue={course?.price ?? 0}
          />
          <p className="text-xs text-muted-foreground">Set 0 to make your course free.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="language">Language</Label>
          <Input id="language" name="language" defaultValue={course?.language ?? "English"} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="imageUrl">Cover image (optional)</Label>
        <FileUploadField
          id="imageUrl"
          name="imageUrl"
          kind="image"
          defaultValue={course?.imageUrl ?? ""}
          placeholder="https://..."
          uploadsEnabled={uploadsEnabled}
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="w-fit bg-green-600 text-white hover:bg-green-700"
      >
        {pending ? <Loader2 className="animate-spin" /> : <Save />}
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
