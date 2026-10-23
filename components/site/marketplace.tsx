import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { categoryIcons, featuredCategories } from "@/lib/category-icons"
import { categoryGradient } from "@/lib/course-utils"
import { getPublishedCourses } from "@/lib/queries/courses"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CourseCard, CourseGridSkeleton } from "@/components/courses/course-card"
import { Reveal } from "@/components/site/reveal"

export function CategoriesSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-medium text-green-600">🗂️ Browse by field</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Learn skills for school, work and life
            </h2>
          </div>
          <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }), "group")}>
            All courses
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featuredCategories.map((category, i) => {
            const Icon = categoryIcons[category.slug]
            return (
              <Reveal key={category.slug} delay={(i % 4) * 70}>
                <Link
                  href={`/explore?category=${category.slug}`}
                  className="group flex h-full items-center gap-3 rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-lg"
                >
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-white transition-transform duration-300 group-hover:scale-110",
                      categoryGradient(category.slug)
                    )}
                  >
                    {Icon && <Icon className="size-5" />}
                  </span>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

async function PopularCoursesGrid() {
  const courses = await getPublishedCourses({ take: 8 })

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

export function PopularCourses() {
  return (
    <section className="bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-medium text-green-600">🔥 Popular right now</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Courses learners love
            </h2>
            <p className="mt-2 text-muted-foreground">
              Taught by doctors, accountants, developers, farmers and creatives.
            </p>
          </div>
          <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }), "group")}>
            Explore all
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="mt-10">
          <Suspense fallback={<CourseGridSkeleton count={8} />}>
            <PopularCoursesGrid />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export function TeachBanner() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <span className="text-sm font-medium text-green-600">🎤 Become an instructor</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Turn your experience into a course
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whether you are a nurse, an accountant, a software engineer or a farmer, people
            want to learn what you know. Create a course for free and earn from every student.
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {[
              "Upload video lessons, notes and resources",
              "Set your own price or teach for free",
              "Track enrollments from your instructor dashboard",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/teach"
              className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
            >
              Start teaching
            </Link>
            <Link href="/instructor/courses/new" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Create a course
            </Link>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative">
            <div className="rounded-2xl border bg-card p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Instructor dashboard</p>
                <span className="rounded-md bg-green-600/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                  Published
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Students", value: "1,284" },
                  { label: "Courses", value: "3" },
                  { label: "Earned", value: "KSh 96k" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-muted/60 p-3">
                    <p className="text-lg font-semibold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {[
                  { emoji: "📊", title: "Bookkeeping for Small Businesses", students: 642 },
                  { emoji: "🧮", title: "Excel for Accountants", students: 418 },
                  { emoji: "🎓", title: "Grade 6 Mathematics Revision", students: 224 },
                ].map((course, i) => (
                  <li key={course.title} className="flex items-center gap-3 rounded-lg border p-3">
                    <span className="text-xl">{course.emoji}</span>
                    <span className="flex-1 truncate text-sm font-medium">{course.title}</span>
                    <span className="text-xs text-muted-foreground">{course.students} students</span>
                    <span
                      className="h-1.5 w-12 origin-left animate-fill-bar rounded-full bg-green-600"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -top-5 -right-3 hidden animate-float rounded-xl border bg-card px-4 py-3 shadow-lg sm:block">
              <p className="text-xs text-muted-foreground">New enrollment</p>
              <p className="text-sm font-semibold">+ 12 students today 🎉</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
