import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Clock, LineChart, Target, UserPlus, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader, SectionHeading } from "@/components/site/page-header";
import { IconCardGrid, Section } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";
import { CallToAction } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "Child report",
  description: "Track your child's learning progress with clear reports for every subject.",
};

const features = [
  { icon: LineChart, title: "Progress per subject", text: "See scores and completion for every learning area at a glance." },
  { icon: Target, title: "Topics to improve", text: "We highlight the topics where your child needs more practice." },
  { icon: Clock, title: "Time spent learning", text: "Know how much time your child spends on lessons and quizzes each day." },
  { icon: Bell, title: "Weekly summary", text: "Get a weekly email with highlights and suggestions." },
  { icon: Users, title: "Many children, one account", text: "Add all your children and switch between their reports easily." },
  { icon: UserPlus, title: "Share with teachers", text: "Share reports with your child's teacher to plan support together." },
];

const subjects = [
  { name: "Mathematics", score: 82, trend: "+6%" },
  { name: "English", score: 74, trend: "+3%" },
  { name: "Kiswahili", score: 88, trend: "+4%" },
  { name: "Science & Technology", score: 69, trend: "+9%" },
  { name: "Social Studies", score: 77, trend: "+2%" },
  { name: "CRE", score: 91, trend: "+1%" },
];

export default function ChildReportPage() {
  return (
    <>
      <PageHeader
        eyebrow="📊 MlimaLMS child report"
        title="Track your child's learning progress"
        description="Clear, simple reports that show what your child has learned, how well they are doing and where they need help."
      >
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
        >
          Add your child
        </Link>
      </PageHeader>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-medium text-green-600">👀 Sample report</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Everything in one view</h2>
            <p className="mt-4 text-muted-foreground">
              The child report updates automatically as your child completes lessons,
              quizzes and revision papers. No waiting for the end of term.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="rounded-2xl border bg-card p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-green-600/15 font-semibold text-green-700 dark:text-green-400">
                  AW
                </span>
                <div className="flex-1">
                  <p className="font-semibold">Amani Wambui</p>
                  <p className="text-xs text-muted-foreground">Grade 6 · Term 3 · Week 8</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">80%</p>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
              </div>
              <ul className="mt-6 flex flex-col gap-4">
                {subjects.map((subject, i) => (
                  <li key={subject.name}>
                    <div className="flex justify-between text-sm">
                      <span>{subject.name}</span>
                      <span>
                        <span className="font-medium">{subject.score}%</span>{" "}
                        <span className="text-xs text-green-600">{subject.trend}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full origin-left animate-fill-bar rounded-full bg-linear-to-r from-green-600 to-emerald-400"
                        style={{ width: `${subject.score}%`, animationDelay: `${i * 100}ms` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="👨‍👩‍👧 Built for parents" title="Stay involved in your child's learning" />
        <div className="mt-12">
          <IconCardGrid items={features} />
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
