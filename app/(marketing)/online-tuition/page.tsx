import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock,
  Globe,
  MessageSquare,
  MonitorPlay,
  Users,
  Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, SectionHeading } from "@/components/site/page-header";
import { CheckList, IconCardGrid, Section } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";
import { CallToAction } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "Online tuition",
  description: "Interactive live online tuition classes for Grade 4 to Grade 9, Monday to Friday, 6:00 PM to 7:00 PM.",
};

const benefits = [
  { icon: Video, title: "Live and interactive", text: "Learners see and hear the teacher, answer polls and ask questions in real time." },
  { icon: Users, title: "Small classes", text: "Classes are kept small so every learner gets attention." },
  { icon: MonitorPlay, title: "Every class recorded", text: "Missed a class? Rewatch it anytime from your dashboard." },
  { icon: CalendarClock, title: "After school hours", text: "Monday to Friday, 6:00 PM to 7:00 PM, when learners are home." },
  { icon: MessageSquare, title: "Homework support", text: "Teachers set short assignments and give feedback on every one." },
  { icon: Globe, title: "Learn from anywhere", text: "Join from a phone, tablet or computer with a stable internet connection." },
];

const cbcTimetable = [
  { day: "Monday", subject: "Mathematics" },
  { day: "Tuesday", subject: "English" },
  { day: "Wednesday", subject: "Science & Technology" },
  { day: "Thursday", subject: "Kiswahili" },
  { day: "Friday", subject: "Social Studies & CRE / IRE" },
];

const britishTimetable = [
  { day: "Monday", subject: "Mathematics" },
  { day: "Tuesday", subject: "English Language" },
  { day: "Wednesday", subject: "Science" },
  { day: "Thursday", subject: "Computing" },
  { day: "Friday", subject: "Humanities" },
];

function Timetable({ rows, grades }: { rows: { day: string; subject: string }[]; grades: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b bg-muted/50 px-5 py-3">
        <p className="font-semibold">{grades}</p>
        <Badge className="bg-green-600/10 text-green-700 dark:text-green-400">6:00 PM to 7:00 PM</Badge>
      </div>
      <ul className="divide-y">
        {rows.map((row, i) => (
          <li key={row.day} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
            <span className="w-24 text-sm font-medium text-muted-foreground">{row.day}</span>
            <Video className="size-4 text-green-600" />
            <span className="flex-1 text-sm font-medium">{row.subject}</span>
            {i === 0 ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                Live today
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Live class</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OnlineTuitionPage() {
  return (
    <>
      <PageHeader
        eyebrow="🎥 Interactive online classes"
        title="Embrace future learning with live online tuition"
        description="Interactive online tuition classes for Grade 4 to Grade 9 at KSh 750 per month. Join us Monday to Friday, 6:00 PM to 7:00 PM."
      >
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
        >
          Enroll now
        </Link>
        <a href="#timetable" className={buttonVariants({ size: "lg", variant: "outline" })}>
          View timetable
        </a>
      </PageHeader>

      <Section>
        <SectionHeading eyebrow="✨ Why learners love it" title="Learning that feels like a real classroom" />
        <div className="mt-12">
          <IconCardGrid items={benefits} />
        </div>
      </Section>

      <Section id="timetable" muted>
        <SectionHeading
          eyebrow="🗓️ Weekly timetable"
          title="CBC and British curriculum classes"
          description="Live and engaging classes for both the Kenyan CBC and the British curriculum."
        />
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <Tabs defaultValue="cbc" className="items-center">
            <TabsList>
              <TabsTrigger value="cbc">CBC · Grade 4 to 9</TabsTrigger>
              <TabsTrigger value="british">British curriculum</TabsTrigger>
            </TabsList>
            <TabsContent value="cbc" className="mt-6 w-full">
              <Timetable rows={cbcTimetable} grades="CBC · Grade 4 to Grade 9" />
            </TabsContent>
            <TabsContent value="british" className="mt-6 w-full">
              <Timetable rows={britishTimetable} grades="British curriculum · Year 4 to Year 9" />
            </TabsContent>
          </Tabs>
        </Reveal>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-medium text-green-600">💳 One simple price</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">KSh 750 per month</h2>
            <p className="mt-4 text-muted-foreground">
              One subscription gives your child access to every live class for their grade,
              all recorded lessons and weekly homework with feedback.
            </p>
            <CheckList
              className="mt-6"
              items={[
                "20 live classes every month",
                "Unlimited access to recordings",
                "Weekly homework and teacher feedback",
                "Progress shown in the child report",
              ]}
            />
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "mt-8 bg-green-600 text-white hover:bg-green-700")}
            >
              Enroll your child
            </Link>
          </Reveal>
          <Reveal delay={150}>
            <div className="rounded-2xl border bg-linear-to-br from-green-600/10 via-transparent to-emerald-400/10 p-8">
              <ol className="flex flex-col gap-5">
                {[
                  "Create a free MlimaLMS account",
                  "Add your child and choose their grade",
                  "Subscribe to online tuition for KSh 750",
                  "Join the class at 6:00 PM from your dashboard",
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
