import Image from "next/image"
import Link from "next/link"
import { BookOpen, Clock, Users } from "lucide-react"

import type { CourseCardData } from "@/lib/queries/courses"
import { categoryGradient, formatDuration, formatPrice, levelLabels } from "@/lib/course-utils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function CourseThumbnail({
  imageUrl,
  title,
  categorySlug,
  icon,
  className,
}: {
  imageUrl: string | null
  title: string
  categorySlug: string
  icon: string
  className?: string
}) {
  return (
    <div className={cn("relative aspect-video overflow-hidden bg-muted", className)}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className={cn(
            "flex size-full items-center justify-center bg-linear-to-br text-5xl",
            categoryGradient(categorySlug)
          )}
        >
          <span className="transition-transform duration-500 group-hover:scale-110">{icon}</span>
        </div>
      )}
    </div>
  )
}

export function CourseCard({ course, href }: { course: CourseCardData; href?: string }) {
  const totalMinutes = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0)

  return (
    <Link
      href={href ?? `/explore/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <CourseThumbnail
          imageUrl={course.imageUrl}
          title={course.title}
          categorySlug={course.category.slug}
          icon={course.category.icon}
        />
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur">
          {course.category.icon} {course.category.name}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-green-600">
          {course.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{course.instructor.name}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {course._count.lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(totalMinutes)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {course._count.enrollments}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xs text-muted-foreground">{levelLabels[course.level]}</span>
          <span className={cn("font-semibold", course.price === 0 && "text-green-600")}>
            {formatPrice(course.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function CourseGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border bg-card">
          <Skeleton className="aspect-video rounded-none" />
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-3 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
