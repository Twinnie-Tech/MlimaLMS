import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Flame, PlayCircle, Trophy, Video } from "lucide-react";

import { courses, liveClasses, revisionPapers, weeklyActivity } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Greeting } from "@/components/dashboard/greeting";
import { ProgressBar, StatCard } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const maxMinutes = Math.max(...weeklyActivity.map((day) => day.minutes));
  const inProgress = courses.filter((course) => course.completed < course.lessons).slice(0, 3);
  const nextClass = liveClasses[0];
  const results = revisionPapers.filter((paper) => paper.status === "completed");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Greeting />
          <p className="mt-1 text-sm text-muted-foreground">
            Here is what is happening with your learning this week.
          </p>
        </div>
        <Link
          href="/courses"
          className={cn(buttonVariants(), "bg-green-600 text-white hover:bg-green-700")}
        >
          <PlayCircle />
          Continue learning
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Lessons completed" value="160" hint="+14 this week" />
        <StatCard icon={Clock} label="Learning time" value="5h 30m" hint="This week" />
        <StatCard icon={Trophy} label="Average score" value="80%" hint="+4% from last month" />
        <StatCard icon={Flame} label="Learning streak" value="12 days" hint="Keep it going!" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Weekly activity</CardTitle>
            <CardDescription>Minutes spent learning each day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end justify-between gap-3">
              {weeklyActivity.map((day, i) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">{day.minutes}m</span>
                  <div className="flex h-36 w-full items-end">
                    <div
                      className="w-full origin-bottom animate-grow-bar rounded-t-md bg-linear-to-t from-green-600 to-emerald-400"
                      style={{ height: `${(day.minutes / maxMinutes) * 100}%`, animationDelay: `${i * 80}ms` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Next live class</CardTitle>
            <CardDescription>{nextClass.day}, {nextClass.date} · {nextClass.time}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-xl bg-linear-to-br from-green-600 to-emerald-700 p-5 text-white">
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-white" />
                </span>
                Starts at {nextClass.time}
              </span>
              <p className="mt-3 text-lg font-semibold">{nextClass.subject}</p>
              <p className="text-sm text-green-50">{nextClass.topic}</p>
              <p className="mt-3 text-xs text-green-100">with {nextClass.teacher}</p>
            </div>
            <Link href="/live-classes" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              <Video />
              View timetable
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Continue learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </div>
            <Link href="/courses" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline">
              All courses <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {inProgress.map((course, i) => {
              const percent = Math.round((course.completed / course.lessons) * 100);
              return (
                <div key={course.id} className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/40">
                  <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-xl", course.color)}>
                    {course.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="truncate font-medium">{course.title}</span>
                      <span className="text-muted-foreground">{percent}%</span>
                    </div>
                    <ProgressBar value={percent} delay={i * 100} className="mt-2" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {course.completed} of {course.lessons} lessons · {course.teacher}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent results</CardTitle>
            <CardDescription>Your latest revision scores</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {results.map((paper) => (
              <div key={paper.title} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{paper.title}</p>
                  <p className="text-xs text-muted-foreground">{paper.subject}</p>
                </div>
                <Badge className={cn(
                  (paper.score ?? 0) >= 80
                    ? "bg-green-600/10 text-green-700 dark:text-green-400"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                )}>
                  {paper.score}%
                </Badge>
              </div>
            ))}
            <Link href="/revision" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              Go to revision
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
