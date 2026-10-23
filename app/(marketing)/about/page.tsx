import type { Metadata } from "next";
import Link from "next/link";
import {
  Eye,
  HeartHandshake,
  Lightbulb,
  PlayCircle,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { team } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader, SectionHeading } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { CallToAction, Stats, Testimonials } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "About us",
  description: "Our mission, our team and why we built MlimaLMS.",
};

const values = [
  { icon: Target, title: "Our mission", text: "To give every Kenyan learner access to quality, affordable and engaging education, wherever they are." },
  { icon: Eye, title: "Our vision", text: "A future where every child can learn at their own pace and every parent can follow their journey." },
  { icon: HeartHandshake, title: "Learner first", text: "Every lesson, quiz and feature is designed around what helps learners understand and grow." },
  { icon: ShieldCheck, title: "Quality content", text: "All content is aligned to the KICD curriculum and reviewed by experienced teachers." },
  { icon: Lightbulb, title: "Innovation", text: "We use technology to make learning interactive, personal and fun." },
  { icon: Users, title: "Community", text: "We work hand in hand with parents, teachers and schools across Kenya." },
];

const pitch = [
  { icon: Target, title: "The problem", text: "Many learners lack access to extra lessons, quality revision materials and regular feedback. Parents struggle to know how their children are really doing." },
  { icon: Lightbulb, title: "Our solution", text: "One affordable platform with live classes, recorded lessons, revision papers and a child report, available on any phone, tablet or computer." },
  { icon: TrendingUp, title: "The impact", text: "Learners improve their scores, parents stay involved and schools bring digital learning into every classroom." },
];

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2);
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="🧬 Our DNA"
        title="Making quality learning accessible to every child"
        description="MlimaLMS is an intelligent e-tutoring solution for learners, teachers and parents. We started in the Mt Kenya region with one goal: help every learner reach their full potential."
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="💚 What drives us"
            title="Our mission, vision and values"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <div className="group h-full rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-lg">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-green-600/10 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                    <value.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <section id="team" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="👋 Meet our team"
            title="The people behind MlimaLMS"
            description="Teachers, engineers and designers working together to make learning better."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 80}>
                <div className="flex h-full flex-col items-center rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-green-600 to-emerald-400 text-2xl font-bold text-white">
                    {initials(member.name)}
                  </span>
                  <h3 className="mt-4 font-semibold">{member.name}</h3>
                  <p className="text-sm text-green-600">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div id="testimonials" className="scroll-mt-20">
        <Testimonials />
      </div>

      <section id="pitch" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="🎤 MlimaLMS pitch"
            title="Why we built MlimaLMS"
          />
          <Reveal className="mx-auto mt-12 max-w-4xl">
            <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border bg-linear-to-br from-green-600 to-emerald-800">
              <div aria-hidden className="absolute -top-20 -left-20 size-72 animate-float rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex flex-col items-center gap-3 text-white">
                <PlayCircle className="size-20 transition-transform duration-300 group-hover:scale-110" />
                <p className="font-medium">Watch our 3 minute pitch</p>
              </div>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pitch.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="h-full rounded-2xl border bg-card p-6">
                  <item.icon className="size-6 text-green-600" />
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/support"
              className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
