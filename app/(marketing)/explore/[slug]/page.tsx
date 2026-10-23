import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Globe,
  Lock,
  Pencil,
  PlayCircle,
  Signal,
  Users,
  Video,
} from "lucide-react";

import { getCourseBySlug, isEnrolled } from "@/lib/queries/courses";
import { categoryGradient, formatDuration, formatPrice, levelLabels } from "@/lib/course-utils";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseThumbnail } from "@/components/courses/course-card";
import { EnrollButton } from "@/components/courses/enroll-button";

type Params = PageProps<"/explore/[slug]">["params"];

export default function CourseDetailPage({ params }: PageProps<"/explore/[slug]">) {
  return (
    <Suspense fallback={<CourseDetailSkeleton />}>
      <CourseDetail params={params} />
    </Suspense>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-6 h-12 w-2/3" />
      <Skeleton className="mt-4 h-6 w-1/2" />
      <Skeleton className="mt-10 h-64 w-full" />
    </div>
  );
}

async function CourseDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const [course, session] = await Promise.all([getCourseBySlug(slug), getSession()]);

  const isOwner = session?.user.id === course?.instructorId;
  if (!course || (course.status !== "PUBLISHED" && !isOwner)) notFound();

  const enrolled = session ? await isEnrolled(session.user.id, course.id) : false;
  const totalMinutes = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const videoLessons = course.lessons.filter((lesson) => lesson.videoUrl).length;

  return (
    <>
      <section className={cn("relative overflow-hidden bg-linear-to-br text-white", categoryGradient(course.category.slug))}>
        <div aria-hidden className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-16">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <nav className="flex items-center gap-1 text-sm text-white/80">
              <Link href="/explore" className="hover:text-white hover:underline">Explore</Link>
              <ChevronRight className="size-4" />
              <Link href={`/explore?category=${course.category.slug}`} className="hover:text-white hover:underline">
                {course.category.name}
              </Link>
            </nav>
            {course.status !== "PUBLISHED" && (
              <Badge className="mt-4 bg-amber-400 text-amber-950">Draft preview, only you can see this</Badge>
            )}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{course.title}</h1>
            {course.subtitle && <p className="mt-3 text-lg text-white/90">{course.subtitle}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
              <span className="flex items-center gap-1.5"><Users className="size-4" />{course._count.enrollments} students</span>
              <span className="flex items-center gap-1.5"><BookOpen className="size-4" />{course.lessons.length} lessons</span>
              <span className="flex items-center gap-1.5"><Clock className="size-4" />{formatDuration(totalMinutes)}</span>
              <span className="flex items-center gap-1.5"><Signal className="size-4" />{levelLabels[course.level]}</span>
              <span className="flex items-center gap-1.5"><Globe className="size-4" />{course.language}</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Avatar>
                {course.instructor.image && <AvatarImage src={course.instructor.image} alt={course.instructor.name} />}
                <AvatarFallback className="text-foreground">{course.instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{course.instructor.name}</p>
                {course.instructor.headline && <p className="text-white/80">{course.instructor.headline}</p>}
              </div>
            </div>
          </div>

          <aside className="lg:row-span-2">
            <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl animate-in fade-in zoom-in-95 duration-700 lg:sticky lg:top-24">
              <CourseThumbnail
                imageUrl={course.imageUrl}
                title={course.title}
                categorySlug={course.category.slug}
                icon={course.category.icon}
              />
              <div className="flex flex-col gap-4 p-6">
                <p className={cn("text-3xl font-bold", course.price === 0 && "text-green-600")}>
                  {formatPrice(course.price)}
                </p>
                {isOwner ? (
                  <Link
                    href={`/instructor/courses/${course.id}`}
                    className={cn(buttonVariants({ size: "lg" }), "w-full")}
                  >
                    <Pencil />
                    Edit your course
                  </Link>
                ) : enrolled ? (
                  <Link
                    href={`/learn/${course.slug}`}
                    className={cn(buttonVariants({ size: "lg" }), "w-full bg-green-600 text-white hover:bg-green-700")}
                  >
                    <PlayCircle />
                    Go to course
                  </Link>
                ) : session ? (
                  <EnrollButton courseId={course.id} price={course.price} />
                ) : (
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(`/explore/${course.slug}`)}`}
                    className={cn(buttonVariants({ size: "lg" }), "w-full bg-green-600 text-white hover:bg-green-700")}
                  >
                    Log in to enroll
                  </Link>
                )}
                {course.price > 0 && !enrolled && !isOwner && (
                  <p className="text-center text-xs text-muted-foreground">
                    M-Pesa checkout is coming soon. Enrollment is open during our beta.
                  </p>
                )}
                <ul className="flex flex-col gap-2 border-t pt-4 text-sm">
                  <li className="flex items-center gap-2"><Video className="size-4 text-green-600" />{videoLessons} video lessons</li>
                  <li className="flex items-center gap-2"><FileText className="size-4 text-green-600" />Lesson notes and resources</li>
                  <li className="flex items-center gap-2"><Clock className="size-4 text-green-600" />Learn at your own pace</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-green-600" />Track your progress</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">About this course</h2>
            <p className="mt-4 leading-relaxed whitespace-pre-line text-muted-foreground">{course.description}</p>
          </section>

          <section>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Course content</h2>
              <span className="text-sm text-muted-foreground">
                {course.lessons.length} lessons · {formatDuration(totalMinutes)}
              </span>
            </div>
            <ol className="mt-4 divide-y overflow-hidden rounded-xl border">
              {course.lessons.map((lesson, i) => {
                const open = enrolled || isOwner || lesson.isFreePreview;
                const row = (
                  <>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{lesson.title}</span>
                      {lesson.description && (
                        <span className="block truncate text-xs text-muted-foreground">{lesson.description}</span>
                      )}
                    </span>
                    {lesson.isFreePreview && !enrolled && !isOwner && (
                      <Badge variant="secondary"><Eye />Preview</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{formatDuration(lesson.duration)}</span>
                    {open ? (
                      <PlayCircle className="size-4 text-green-600" />
                    ) : (
                      <Lock className="size-4 text-muted-foreground" />
                    )}
                  </>
                );
                return (
                  <li key={lesson.id}>
                    {open && session ? (
                      <Link
                        href={`/learn/${course.slug}?lesson=${lesson.id}`}
                        className="flex items-center gap-3 bg-card px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 bg-card px-4 py-3 text-sm">{row}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Your instructor</h2>
            <div className="mt-4 flex flex-col gap-4 rounded-xl border bg-card p-6 sm:flex-row">
              <Avatar className="size-16">
                {course.instructor.image && <AvatarImage src={course.instructor.image} alt={course.instructor.name} />}
                <AvatarFallback className="text-xl">{course.instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{course.instructor.name}</p>
                {course.instructor.headline && (
                  <p className="text-sm text-green-600">{course.instructor.headline}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {course.instructor._count.coursesTaught} published courses
                </p>
                {course.instructor.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{course.instructor.bio}</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
