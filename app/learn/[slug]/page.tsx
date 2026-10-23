import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, FileText, PlayCircle } from "lucide-react";

import { formatDuration } from "@/lib/course-utils";
import { getLearningCourse } from "@/lib/queries/courses";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/ui/themetoggle";
import { CompleteButton } from "@/components/courses/complete-button";
import { VideoPlayer } from "@/components/courses/video-player";
import { ProgressBar } from "@/components/dashboard/ui";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = { title: "Learning" };

async function Player({ params, searchParams }: PageProps<"/learn/[slug]">) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const user = await requireUser(`/learn/${slug}`);
  const data = await getLearningCourse(slug, user.id);

  if (!data) notFound();
  const { course, canAccess, completedIds } = data;
  if (!canAccess) redirect(`/explore/${slug}`);

  const completed = new Set(completedIds);
  const requested = typeof query.lesson === "string" ? query.lesson : undefined;
  const index = Math.max(
    0,
    requested
      ? course.lessons.findIndex((lesson) => lesson.id === requested)
      : course.lessons.findIndex((lesson) => !completed.has(lesson.id))
  );
  const lesson = course.lessons[index];
  const previous = course.lessons[index - 1];
  const next = course.lessons[index + 1];
  const progress = course.lessons.length
    ? Math.round((completed.size / course.lessons.length) * 100)
    : 0;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur-md sm:px-6">
        <Link href="/courses" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft />
          <span className="sr-only">Back to my courses</span>
        </Link>
        <Logo className="hidden md:flex [&>span:last-child]:hidden" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{course.title}</p>
          <p className="truncate text-xs text-muted-foreground">{course.instructor.name}</p>
        </div>
        <div className="hidden w-48 sm:block">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Your progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <ProgressBar value={progress} className="mt-1.5" />
        </div>
        <ModeToggle />
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_340px]">
        <main className="flex min-w-0 flex-col gap-5">
          {!lesson ? (
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
              This course has no lessons yet. Check back soon.
            </div>
          ) : (
            <>
              {lesson.videoUrl ? (
                <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl border bg-linear-to-br from-green-600/10 to-emerald-400/10">
                  <FileText className="size-12 text-green-600" />
                </div>
              )}

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Lesson {index + 1} of {course.lessons.length} · {formatDuration(lesson.duration)}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight">{lesson.title}</h1>
                </div>
                <CompleteButton lessonId={lesson.id} completed={completed.has(lesson.id)} />
              </div>

              {lesson.description && <p className="text-muted-foreground">{lesson.description}</p>}

              {lesson.content && (
                <article className="rounded-xl border bg-card p-5 text-sm leading-relaxed whitespace-pre-line">
                  {lesson.content}
                </article>
              )}

              <div className="flex justify-between gap-3 border-t pt-5">
                {previous ? (
                  <Link
                    href={`/learn/${course.slug}?lesson=${previous.id}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <ChevronLeft />
                    Previous
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    href={`/learn/${course.slug}?lesson=${next.id}`}
                    className={cn(buttonVariants(), "bg-green-600 text-white hover:bg-green-700")}
                  >
                    Next lesson
                    <ChevronRight />
                  </Link>
                ) : (
                  <Link href="/courses" className={buttonVariants({ variant: "outline" })}>
                    Back to my courses
                  </Link>
                )}
              </div>
            </>
          )}
        </main>

        <aside className="h-fit overflow-hidden rounded-xl border bg-card lg:sticky lg:top-22">
          <div className="border-b p-4">
            <p className="font-semibold">Course content</p>
            <p className="text-xs text-muted-foreground">
              {completed.size} of {course.lessons.length} lessons completed
            </p>
            <ProgressBar value={progress} className="mt-2 sm:hidden" />
          </div>
          <ol className="max-h-[60vh] overflow-y-auto p-2">
            {course.lessons.map((item, i) => {
              const active = item.id === lesson?.id;
              const done = completed.has(item.id);
              return (
                <li key={item.id}>
                  <Link
                    href={`/learn/${course.slug}?lesson=${item.id}`}
                    className={cn(
                      "flex items-start gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-muted",
                      active && "bg-green-600/10 hover:bg-green-600/15"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                    ) : item.videoUrl ? (
                      <PlayCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className={cn("font-medium", active && "text-green-700 dark:text-green-400")}>
                        {i + 1}. {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatDuration(item.duration)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </>
  );
}

function PlayerSkeleton() {
  return (
    <>
      <div className="h-16 border-b" />
      <div className="mx-auto grid w-full max-w-7xl gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="h-8 w-2/3" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </>
  );
}

export default function LearnPage(props: PageProps<"/learn/[slug]">) {
  return (
    <div className="flex min-h-svh flex-col bg-muted/20">
      <Suspense fallback={<PlayerSkeleton />}>
        <Player {...props} />
      </Suspense>
    </div>
  );
}
