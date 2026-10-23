"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"

import { prisma } from "@/lib/db"
import { slugify } from "@/lib/course-utils"
import { deleteUploadedFile } from "@/lib/s3"
import { requireUser } from "@/lib/session"

export type FormState = { error?: string; success?: string } | undefined

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .pipe(z.url("Enter a valid link starting with https://").optional())

const courseSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(120),
  subtitle: z.string().trim().max(160).optional(),
  description: z.string().trim().min(30, "Describe your course in at least 30 characters"),
  categoryId: z.string().min(1, "Choose a category"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
  language: z.string().trim().min(2).max(40),
  price: z.coerce.number().int().min(0, "Price cannot be negative").max(500000),
  imageUrl: optionalUrl,
})

const lessonSchema = z.object({
  title: z.string().trim().min(3, "Lesson title must be at least 3 characters").max(120),
  description: z.string().trim().max(300).optional(),
  videoUrl: optionalUrl,
  content: z.string().trim().max(20000).optional(),
  duration: z.coerce.number().int().min(0).max(600),
  isFreePreview: z.boolean(),
})

function parseCourse(formData: FormData) {
  return courseSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    level: formData.get("level"),
    language: formData.get("language") || "English",
    price: formData.get("price") || 0,
    imageUrl: formData.get("imageUrl") ?? "",
  })
}

async function uniqueSlug(title: string) {
  const base = slugify(title) || "course"
  let slug = base
  for (let i = 2; await prisma.course.findUnique({ where: { slug } }); i++) {
    slug = `${base}-${i}`
  }
  return slug
}

async function getOwnedCourse(courseId: string) {
  const user = await requireUser()
  const course = await prisma.course.findFirst({ where: { id: courseId, instructorId: user.id } })
  if (!course) throw new Error("Course not found")
  return course
}

function revalidateCourse(slug: string, id: string) {
  revalidatePath("/explore")
  revalidatePath(`/explore/${slug}`)
  revalidatePath("/instructor")
  revalidatePath(`/instructor/courses/${id}`)
}

export async function createCourse(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/instructor/courses/new")
  const parsed = parseCourse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const course = await prisma.course.create({
    data: { ...parsed.data, slug: await uniqueSlug(parsed.data.title), instructorId: user.id },
  })

  revalidatePath("/instructor")
  redirect(`/instructor/courses/${course.id}?created=1`)
}

export async function updateCourse(courseId: string, _state: FormState, formData: FormData): Promise<FormState> {
  const course = await getOwnedCourse(courseId)
  const parsed = parseCourse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.course.update({
    where: { id: course.id },
    data: { ...parsed.data, imageUrl: parsed.data.imageUrl ?? null },
  })
  if (course.imageUrl !== (parsed.data.imageUrl ?? null)) await deleteUploadedFile(course.imageUrl)
  revalidateCourse(course.slug, course.id)
  return { success: "Course details saved" }
}

export async function addLesson(courseId: string, _state: FormState, formData: FormData): Promise<FormState> {
  const course = await getOwnedCourse(courseId)
  const parsed = lessonSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    videoUrl: formData.get("videoUrl") ?? "",
    content: formData.get("content") || undefined,
    duration: formData.get("duration") || 0,
    isFreePreview: formData.get("isFreePreview") === "on",
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  if (!parsed.data.videoUrl && !parsed.data.content) {
    return { error: "Add a video link or written content for this lesson" }
  }

  const position = await prisma.lesson.count({ where: { courseId: course.id } })
  await prisma.lesson.create({ data: { ...parsed.data, position, courseId: course.id } })

  revalidateCourse(course.slug, course.id)
  return { success: "Lesson added" }
}

export async function deleteLesson(lessonId: string) {
  const user = await requireUser()
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, course: { instructorId: user.id } },
    include: { course: true },
  })
  if (!lesson) throw new Error("Lesson not found")

  await prisma.$transaction([
    prisma.lesson.delete({ where: { id: lesson.id } }),
    prisma.lesson.updateMany({
      where: { courseId: lesson.courseId, position: { gt: lesson.position } },
      data: { position: { decrement: 1 } },
    }),
  ])
  await deleteUploadedFile(lesson.videoUrl)
  revalidateCourse(lesson.course.slug, lesson.courseId)
}

export async function togglePublish(courseId: string): Promise<FormState> {
  const course = await getOwnedCourse(courseId)

  if (course.status === "DRAFT") {
    const lessons = await prisma.lesson.count({ where: { courseId: course.id } })
    if (lessons === 0) return { error: "Add at least one lesson before publishing" }
  }

  const status = course.status === "DRAFT" ? "PUBLISHED" : "DRAFT"
  await prisma.course.update({ where: { id: course.id }, data: { status } })
  revalidateCourse(course.slug, course.id)
  return { success: status === "PUBLISHED" ? "Your course is live!" : "Course moved back to draft" }
}

export async function deleteCourse(courseId: string) {
  const course = await getOwnedCourse(courseId)
  const lessons = await prisma.lesson.findMany({ where: { courseId: course.id }, select: { videoUrl: true } })
  await prisma.course.delete({ where: { id: course.id } })
  await Promise.all([course.imageUrl, ...lessons.map((lesson) => lesson.videoUrl)].map(deleteUploadedFile))
  revalidatePath("/explore")
  revalidatePath("/instructor")
  redirect("/instructor")
}

export async function enrollInCourse(courseId: string): Promise<FormState> {
  const course = await prisma.course.findFirst({ where: { id: courseId, status: "PUBLISHED" } })
  if (!course) return { error: "This course is not available" }

  const user = await requireUser(`/explore/${course.slug}`)
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    update: {},
    create: { userId: user.id, courseId: course.id },
  })

  revalidatePath(`/explore/${course.slug}`)
  revalidatePath("/courses")
  redirect(`/learn/${course.slug}`)
}

export async function toggleLessonComplete(lessonId: string) {
  const user = await requireUser()
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { course: true } })
  if (!lesson) throw new Error("Lesson not found")

  const where = { userId_lessonId: { userId: user.id, lessonId } }
  const existing = await prisma.lessonProgress.findUnique({ where })

  if (existing) {
    await prisma.lessonProgress.delete({ where })
  } else {
    await prisma.lessonProgress.create({ data: { userId: user.id, lessonId } })
  }

  revalidatePath(`/learn/${lesson.course.slug}`)
  revalidatePath("/courses")
  return !existing
}

const instructorProfileSchema = z.object({
  headline: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(1000).optional(),
})

export async function updateInstructorProfile(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser()
  const parsed = instructorProfileSchema.safeParse({
    headline: formData.get("headline") || undefined,
    bio: formData.get("bio") || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.user.update({
    where: { id: user.id },
    data: { headline: parsed.data.headline ?? null, bio: parsed.data.bio ?? null },
  })
  revalidatePath("/instructor")
  return { success: "Instructor profile saved" }
}
