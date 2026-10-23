import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Compass, PlayCircle } from "lucide-react";

import { getEnrolledCourses } from "@/lib/queries/courses";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseGridSkeleton, CourseThumbnail } from "@/components/courses/course-card";
import { PageTitle, ProgressBar } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "My courses" };

type EnrolledCourse = Awaited<ReturnType<typeof getEnrolledCourses>>[number];

function CourseGrid({ items }: { items: EnrolledCourse[] }) {
  if (items.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No courses here yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((course, i) => {
        const done = course.progress === 100;
        return (
          <div
            key={course.id}
            className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative">
              <CourseThumbnail
                imageUrl={course.imageUrl}
                title={course.title}
                categorySlug={course.category.slug}
                icon={course.category.icon}
              />
              <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur">
                {course.category.name}
              </Badge>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="line-clamp-2 font-semibold">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
              <div className="mt-auto pt-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {course.completedLessons} of {course._count.lessons} lessons
                  </span>
                  <span className="font-medium text-foreground">{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} delay={i * 80} className="mt-2" />
                <Link
                  href={`/learn/${course.slug}`}
                  className={cn(
                    buttonVariants({ variant: done ? "outline" : "default" }),
                    "mt-5 w-full",
                    !done && "bg-green-600 text-white hover:bg-green-700"
                  )}
                >
                  <PlayCircle />
                  {done ? "Review course" : course.completedLessons ? "Continue" : "Start course"}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

async function EnrolledCourses() {
  const user = await requireUser("/courses");
  const courses = await getEnrolledCourses(user.id);

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-green-600/10 text-green-600">
          <Compass className="size-6" />
        </span>
        <div>
          <p className="font-semibold">You have not enrolled in any course yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Find courses in technology, health, finance, farming, school subjects and more.
          </p>
        </div>
        <Link href="/explore" className={cn(buttonVariants(), "bg-green-600 text-white hover:bg-green-700")}>
          Explore courses
        </Link>
      </div>
    );
  }

  const inProgress = courses.filter((course) => course.progress < 100);
  const completed = courses.filter((course) => course.progress === 100);

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All ({courses.length})</TabsTrigger>
        <TabsTrigger value="progress">In progress ({inProgress.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <CourseGrid items={courses} />
      </TabsContent>
      <TabsContent value="progress" className="mt-4">
        <CourseGrid items={inProgress} />
      </TabsContent>
      <TabsContent value="completed" className="mt-4">
        <CourseGrid items={completed} />
      </TabsContent>
    </Tabs>
  );
}

export default function CoursesPage() {
  return (
    <>
      <PageTitle title="My courses" description="Every course you have enrolled in, in one place.">
        <Link href="/explore" className={buttonVariants({ variant: "outline" })}>
          <Compass />
          Explore more
        </Link>
      </PageTitle>
      <Suspense fallback={<CourseGridSkeleton count={3} />}>
        <EnrolledCourses />
      </Suspense>
    </>
  );
}
