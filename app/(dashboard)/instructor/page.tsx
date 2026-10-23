import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Eye, Pencil, Plus, Presentation, Users, Wallet } from "lucide-react";

import { prisma } from "@/lib/db";
import { formatDuration, formatPrice } from "@/lib/course-utils";
import { getInstructorCourses } from "@/lib/queries/courses";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseThumbnail } from "@/components/courses/course-card";
import { InstructorProfileForm } from "@/components/courses/instructor-profile-form";
import { PageTitle, StatCard } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Instructor dashboard" };

async function InstructorOverview() {
  const sessionUser = await requireUser("/instructor");
  const [courses, profile] = await Promise.all([
    getInstructorCourses(sessionUser.id),
    prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { headline: true, bio: true },
    }),
  ]);

  const students = courses.reduce((sum, course) => sum + course._count.enrollments, 0);
  const published = courses.filter((course) => course.status === "PUBLISHED").length;
  const potentialEarnings = courses.reduce(
    (sum, course) => sum + course.price * course._count.enrollments,
    0
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Courses" value={String(courses.length)} hint={`${published} published`} />
        <StatCard icon={Users} label="Students" value={students.toLocaleString()} hint="Across all your courses" />
        <StatCard
          icon={Presentation}
          label="Lessons"
          value={String(courses.reduce((sum, course) => sum + course._count.lessons, 0))}
        />
        <StatCard
          icon={Wallet}
          label="Course value"
          value={formatPrice(potentialEarnings).replace("Free", "KSh 0")}
          hint="Price × enrollments"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <h3 className="font-semibold">Your courses</h3>
            <Link href="/instructor/courses/new" className={buttonVariants({ size: "sm", variant: "outline" })}>
              <Plus />
              New course
            </Link>
          </div>
          {courses.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="text-4xl">🎤</span>
              <p className="font-semibold">Share what you know</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Create your first course in any field: technology, health, accounting, farming,
                design, school subjects and more.
              </p>
              <Link
                href="/instructor/courses/new"
                className={cn(buttonVariants(), "mt-2 bg-green-600 text-white hover:bg-green-700")}
              >
                Create your first course
              </Link>
            </div>
          ) : (
            <ul className="divide-y">
              {courses.map((course) => {
                const minutes = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
                return (
                  <li key={course.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <CourseThumbnail
                      imageUrl={course.imageUrl}
                      title={course.title}
                      categorySlug={course.category.slug}
                      icon={course.category.icon}
                      className="w-full shrink-0 rounded-lg text-3xl sm:w-36"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={course.status === "PUBLISHED" ? "default" : "secondary"}
                          className={cn(course.status === "PUBLISHED" && "bg-green-600 text-white")}
                        >
                          {course.status === "PUBLISHED" ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{course.category.name}</span>
                      </div>
                      <p className="mt-1 truncate font-medium">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course._count.lessons} lessons · {formatDuration(minutes)} ·{" "}
                        {course._count.enrollments} students · {formatPrice(course.price)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/explore/${course.slug}`}
                        className={buttonVariants({ size: "sm", variant: "ghost" })}
                      >
                        <Eye />
                        View
                      </Link>
                      <Link
                        href={`/instructor/courses/${course.id}`}
                        className={buttonVariants({ size: "sm", variant: "outline" })}
                      >
                        <Pencil />
                        Edit
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="h-fit rounded-xl border bg-card p-5">
          <h3 className="font-semibold">Instructor profile</h3>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Students see this on every course you publish.
          </p>
          <InstructorProfileForm headline={profile?.headline ?? null} bio={profile?.bio ?? null} />
        </section>
      </div>
    </>
  );
}

function OverviewSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </>
  );
}

export default function InstructorPage() {
  return (
    <>
      <PageTitle
        title="Instructor dashboard"
        description="Create courses in your field, publish them and track your students."
      >
        <Link
          href="/instructor/courses/new"
          className={cn(buttonVariants(), "bg-green-600 text-white hover:bg-green-700")}
        >
          <Plus />
          Create course
        </Link>
      </PageTitle>
      <Suspense fallback={<OverviewSkeleton />}>
        <InstructorOverview />
      </Suspense>
    </>
  );
}
