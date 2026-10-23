import type { Metadata } from "next";
import { BookOpen, School, TrendingUp } from "lucide-react";

import { children } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AddChildDialog } from "@/components/dashboard/add-child-dialog";
import { PageTitle, ProgressBar } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "My children" };

export default function ChildrenPage() {
  return (
    <>
      <PageTitle
        title="My children"
        description="Follow each child's progress with the MlimaLMS child report."
      >
        <AddChildDialog />
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-2">
        {children.map((child) => (
          <Card key={child.name}>
            <CardHeader className="flex flex-row items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-green-600 to-emerald-400 text-lg font-bold text-white">
                {child.name.split(" ").map((part) => part[0]).join("")}
              </span>
              <div className="flex-1">
                <p className="font-semibold">{child.name}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <School className="size-3.5" />
                  {child.grade} · {child.school}
                </p>
              </div>
              <Badge
                className={
                  child.plan === "Free"
                    ? "bg-muted text-muted-foreground"
                    : "bg-green-600/10 text-green-700 dark:text-green-400"
                }
              >
                {child.plan}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="size-3.5" />
                    Average score
                  </p>
                  <p className="mt-1 text-xl font-bold text-green-600">{child.average}%</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="size-3.5" />
                    Lessons this week
                  </p>
                  <p className="mt-1 text-xl font-bold">{child.lessonsThisWeek}</p>
                </div>
              </div>
              <ul className="flex flex-col gap-3">
                {child.subjects.map((subject, i) => (
                  <li key={subject.name}>
                    <div className="flex justify-between text-sm">
                      <span>{subject.name}</span>
                      <span className="font-medium">{subject.score}%</span>
                    </div>
                    <ProgressBar value={subject.score} delay={i * 100} className="mt-1.5" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
