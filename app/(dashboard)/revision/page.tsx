import type { Metadata } from "next";
import { CheckCircle2, FileText, PlayCircle, RotateCcw, Timer } from "lucide-react";

import { revisionPapers } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTitle, StatCard } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Revision" };

const statusBadge = {
  completed: { label: "Completed", className: "bg-green-600/10 text-green-700 dark:text-green-400" },
  "in-progress": { label: "In progress", className: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  new: { label: "New", className: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
};

export default function RevisionPage() {
  const completed = revisionPapers.filter((paper) => paper.status === "completed");
  const average = Math.round(
    completed.reduce((sum, paper) => sum + (paper.score ?? 0), 0) / Math.max(completed.length, 1)
  );

  return (
    <>
      <PageTitle
        title="KPSEA revision"
        description="Mock papers and topical quizzes with instant marking and explanations."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Papers available" value={String(revisionPapers.length)} />
        <StatCard icon={CheckCircle2} label="Papers completed" value={String(completed.length)} />
        <StatCard icon={Timer} label="Average score" value={`${average}%`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {revisionPapers.map((paper) => {
          const status = statusBadge[paper.status];
          return (
            <div
              key={paper.title}
              className="flex flex-col rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-green-600/10 text-green-600">
                  <FileText className="size-5" />
                </span>
                <Badge className={status.className}>{status.label}</Badge>
              </div>
              <h3 className="mt-4 font-semibold">{paper.title}</h3>
              <p className="text-sm text-muted-foreground">{paper.subject}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {paper.questions} questions · {paper.minutes} minutes
              </p>
              {"score" in paper && paper.score !== undefined && (
                <p className="mt-2 text-sm">
                  Score: <span className="font-semibold text-green-600">{paper.score}%</span>
                </p>
              )}
              <Button
                variant={paper.status === "completed" ? "outline" : "default"}
                className={cn(
                  "mt-5 w-full",
                  paper.status !== "completed" && "bg-green-600 text-white hover:bg-green-700"
                )}
              >
                {paper.status === "completed" ? <RotateCcw /> : <PlayCircle />}
                {paper.status === "completed"
                  ? "Review answers"
                  : paper.status === "in-progress"
                    ? "Resume"
                    : "Start paper"}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
