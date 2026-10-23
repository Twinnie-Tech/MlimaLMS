import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, PartyPopper, Users } from "lucide-react";

import { updateCourse } from "@/lib/actions/courses";
import { getCategories, getCourseForEditing } from "@/lib/queries/courses";
import { isS3Configured } from "@/lib/s3";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseForm } from "@/components/courses/course-form";
import { DeleteCourseButton, PublishButton } from "@/components/courses/course-status-actions";
import { LessonManager } from "@/components/courses/lesson-manager";

export const metadata: Metadata = { title: "Edit course" };

async function CourseEditor({ params, searchParams }: PageProps<"/instructor/courses/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const user = await requireUser(`/instructor/courses/${id}`);
  const [course, categories] = await Promise.all([getCourseForEditing(id, user.id), getCategories()]);

  if (!course) notFound();

  const published = course.status === "PUBLISHED";
  const uploadsEnabled = isS3Configured();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/instructor"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Instructor dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{course.title}</h2>
            <Badge
              variant={published ? "default" : "secondary"}
              className={cn(published && "bg-green-600 text-white")}
            >
              {published ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            {course.category.icon} {course.category.name} ·
            <Users className="size-3.5" /> {course._count.enrollments} students
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/explore/${course.slug}`} className={buttonVariants({ variant: "outline" })}>
            <Eye />
            {published ? "View public page" : "Preview"}
          </Link>
          <PublishButton courseId={course.id} published={published} />
        </div>
      </div>

      {query.created && (
        <div className="flex items-start gap-3 rounded-xl border border-green-600/30 bg-green-600/5 p-4 text-sm">
          <PartyPopper className="mt-0.5 size-5 shrink-0 text-green-600" />
          <div>
            <p className="font-medium">Your course has been created as a draft.</p>
            <p className="text-muted-foreground">
              Add your lessons below, then click <strong>Publish course</strong> to make it
              visible to students.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <h3 className="font-semibold">Curriculum</h3>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            {course.lessons.length} lessons.{" "}
            {uploadsEnabled
              ? "Upload videos or paste YouTube and Vimeo links, then add notes."
              : "Add video links (YouTube, Vimeo or .mp4) and notes."}
          </p>
          <LessonManager courseId={course.id} lessons={course.lessons} uploadsEnabled={uploadsEnabled} />
        </section>

        <section className="h-fit rounded-xl border bg-card p-5 sm:p-6">
          <h3 className="mb-5 font-semibold">Course details</h3>
          <CourseForm
            action={updateCourse.bind(null, course.id)}
            categories={categories}
            course={course}
            submitLabel="Save changes"
            uploadsEnabled={uploadsEnabled}
          />
        </section>
      </div>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-destructive/30 p-5">
        <div>
          <h3 className="font-semibold">Danger zone</h3>
          <p className="text-sm text-muted-foreground">
            Deleting a course removes its lessons and all student enrollments.
          </p>
        </div>
        <DeleteCourseButton courseId={course.id} />
      </section>
    </>
  );
}

export default function EditCoursePage(props: PageProps<"/instructor/courses/[id]">) {
  return (
    <Suspense
      fallback={
        <>
          <Skeleton className="h-16 w-full max-w-lg rounded-lg" />
          <div className="grid gap-6 xl:grid-cols-2">
            <Skeleton className="h-125 rounded-xl" />
            <Skeleton className="h-125 rounded-xl" />
          </div>
        </>
      }
    >
      <CourseEditor {...props} />
    </Suspense>
  );
}
