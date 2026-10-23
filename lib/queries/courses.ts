import { prisma } from "@/lib/db"
import type { Prisma } from "@/lib/generated/prisma/client"

export const courseCardInclude = {
  category: { select: { name: true, slug: true, icon: true } },
  instructor: { select: { id: true, name: true, image: true, headline: true } },
  lessons: { select: { duration: true } },
  _count: { select: { lessons: true, enrollments: true } },
} satisfies Prisma.CourseInclude

export type CourseCardData = Prisma.CourseGetPayload<{ include: typeof courseCardInclude }>

export async function getPublishedCourses({
  q,
  category,
  sort = "popular",
  take,
}: {
  q?: string
  category?: string
  sort?: "popular" | "newest" | "price-low" | "price-high"
  take?: number
} = {}) {
  const where: Prisma.CourseWhereInput = {
    status: "PUBLISHED",
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { subtitle: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { instructor: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  }

  const orderBy: Prisma.CourseOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "price-low"
        ? { price: "asc" }
        : sort === "price-high"
          ? { price: "desc" }
          : { enrollments: { _count: "desc" } }

  return prisma.course.findMany({ where, orderBy, take, include: courseCardInclude })
}

export async function getCategoriesWithCounts() {
  return prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { courses: { where: { status: "PUBLISHED" } } } } },
  })
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { position: "asc" } })
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          name: true,
          image: true,
          headline: true,
          bio: true,
          _count: { select: { coursesTaught: { where: { status: "PUBLISHED" } } } },
        },
      },
      lessons: { orderBy: { position: "asc" } },
      _count: { select: { enrollments: true } },
    },
  })
}

export async function isEnrolled(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })
  return Boolean(enrollment)
}

export async function getEnrolledCourses(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { course: { include: courseCardInclude } },
  })

  const courseIds = enrollments.map((item) => item.courseId)
  const [completed, lessons] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, lesson: { courseId: { in: courseIds } } },
      select: { lessonId: true },
    }),
    prisma.lesson.findMany({
      where: { courseId: { in: courseIds } },
      select: { id: true, courseId: true },
    }),
  ])
  const completedIds = new Set(completed.map((item) => item.lessonId))

  return enrollments.map((enrollment) => {
    const courseLessons = lessons.filter((lesson) => lesson.courseId === enrollment.courseId)
    const done = courseLessons.filter((lesson) => completedIds.has(lesson.id)).length
    return {
      ...enrollment.course,
      enrolledAt: enrollment.createdAt,
      completedLessons: done,
      progress: courseLessons.length ? Math.round((done / courseLessons.length) * 100) : 0,
    }
  })
}

export async function getInstructorCourses(instructorId: string) {
  return prisma.course.findMany({
    where: { instructorId },
    orderBy: { updatedAt: "desc" },
    include: courseCardInclude,
  })
}

export async function getCourseForEditing(courseId: string, instructorId: string) {
  return prisma.course.findFirst({
    where: { id: courseId, instructorId },
    include: {
      category: true,
      lessons: { orderBy: { position: "asc" } },
      _count: { select: { enrollments: true } },
    },
  })
}

export async function getLearningCourse(slug: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true } },
      lessons: { orderBy: { position: "asc" } },
    },
  })
  if (!course) return null

  const [enrolled, progress] = await Promise.all([
    isEnrolled(userId, course.id),
    prisma.lessonProgress.findMany({
      where: { userId, lesson: { courseId: course.id } },
      select: { lessonId: true },
    }),
  ])

  return {
    course,
    canAccess: enrolled || course.instructorId === userId,
    completedIds: progress.map((item) => item.lessonId),
  }
}
