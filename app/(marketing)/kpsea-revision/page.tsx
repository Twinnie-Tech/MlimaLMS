import type { Metadata } from "next";
import Link from "next/link";
import {
  BookMarked,
  ClipboardCheck,
  FileText,
  Lightbulb,
  Timer,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader, SectionHeading } from "@/components/site/page-header";
import { IconCardGrid, Section } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";
import { CallToAction } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "KPSEA revision",
  description: "KPSEA and KJSEA revision papers with step by step guidance for candidates.",
};

const features = [
  { icon: FileText, title: "Revision papers", text: "Full papers for every KPSEA and KJSEA subject, set by experienced teachers." },
  { icon: Timer, title: "Timed mock exams", text: "Practise under real exam conditions with a countdown timer." },
  { icon: ClipboardCheck, title: "Instant marking", text: "Get your score as soon as you submit, with every answer marked." },
  { icon: Lightbulb, title: "Step by step explanations", text: "Understand the why behind every answer with worked solutions." },
  { icon: BookMarked, title: "Topical questions", text: "Practise one topic at a time until you master it." },
  { icon: TrendingUp, title: "Track improvement", text: "See scores improve over time in the child report." },
];

const papers = [
  { subject: "Mathematics", papers: 24, questions: 720 },
  { subject: "English", papers: 22, questions: 660 },
  { subject: "Kiswahili", papers: 22, questions: 660 },
  { subject: "Integrated Science", papers: 18, questions: 540 },
  { subject: "Creative Arts & Social Studies", papers: 16, questions: 480 },
];

export default function KpseaRevisionPage() {
  return (
    <>
      <PageHeader
        eyebrow="📝 KPSEA revision papers"
        title="Step by step guidance for exam candidates"
        description="Thousands of revision questions, timed mock exams and clear explanations to help Grade 6 and Grade 9 candidates walk into the exam room with confidence."
      >
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
        >
          Start revising
        </Link>
        <Link href="/downloads" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Download a sample paper
        </Link>
      </PageHeader>

      <Section>
        <SectionHeading eyebrow="🎯 Revise smarter" title="Everything a candidate needs" />
        <div className="mt-12">
          <IconCardGrid items={features} />
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="📚 Paper library" title="Revision papers by subject" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-3">
          {papers.map((paper, i) => (
            <Reveal key={paper.subject} delay={i * 70}>
              <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card px-5 py-4 transition-all hover:border-green-600/40 hover:shadow-md">
                <span className="flex size-10 items-center justify-center rounded-lg bg-green-600/10 text-green-600">
                  <FileText className="size-5" />
                </span>
                <span className="flex-1 font-medium">{paper.subject}</span>
                <span className="text-sm text-muted-foreground">{paper.papers} papers</span>
                <span className="text-sm text-muted-foreground">{paper.questions} questions</span>
                <Link href="/signup" className={buttonVariants({ size: "sm", variant: "outline" })}>
                  Practise
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-medium text-green-600">🧠 Sample question</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Learn from every answer</h2>
            <p className="mt-4 text-muted-foreground">
              Each question comes with a clear explanation so learners understand the method,
              not just the answer. Wrong answers are saved for later revision.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="rounded-2xl border bg-card p-6 shadow-lg">
              <p className="text-xs text-muted-foreground">Mathematics · Question 12 of 30</p>
              <p className="mt-3 font-medium">
                A farmer harvested 2,450 kg of maize and sold 3/5 of it. How many kilograms were left?
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {["1,470 kg", "980 kg", "1,225 kg", "490 kg"].map((option) => (
                  <span
                    key={option}
                    className={cn(
                      "rounded-lg border px-3 py-2",
                      option === "980 kg" && "border-green-600 bg-green-600/10 font-medium"
                    )}
                  >
                    {option}
                  </span>
                ))}
              </div>
              <p className="mt-4 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Explanation: </span>
                3/5 of 2,450 is 1,470 kg sold. 2,450 − 1,470 = 980 kg left.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
