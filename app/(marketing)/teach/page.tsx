import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Globe2,
  Smartphone,
  UploadCloud,
  Users,
  Wallet,
} from "lucide-react";

import { featuredCategories } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader, SectionHeading } from "@/components/site/page-header";
import { IconCardGrid, Section } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Teach on MlimaLMS",
  description: "Share what you know. Create a course in any field and earn from students across Kenya.",
};

const benefits = [
  { icon: Users, title: "Reach thousands of learners", text: "Students across Kenya and beyond are looking for practical skills like yours." },
  { icon: Wallet, title: "Earn from your knowledge", text: "Set your own price or offer free courses to build your audience." },
  { icon: UploadCloud, title: "Easy course builder", text: "Add video lessons from YouTube or Vimeo, notes and resources in minutes." },
  { icon: BarChart3, title: "Track your students", text: "See enrollments and how your course is growing from your dashboard." },
  { icon: Smartphone, title: "Teach from your phone", text: "Record lessons on your phone and publish from anywhere." },
  { icon: Globe2, title: "Any field, any language", text: "Tech, health, finance, farming, music, languages and more." },
];

const steps = [
  { title: "Plan your course", text: "Pick a topic you know well and outline the lessons students need." },
  { title: "Record and upload", text: "Record short videos and add them with notes for each lesson." },
  { title: "Publish", text: "Set a price or make it free, then publish with one click." },
  { title: "Grow and earn", text: "Share your course link and watch your students grow." },
];

const examples = [
  { emoji: "👩‍⚕️", who: "Doctors and nurses", what: "teach first aid, nutrition and patient care" },
  { emoji: "🧮", who: "Accountants", what: "teach bookkeeping, tax and Excel" },
  { emoji: "👨‍💻", who: "Developers", what: "teach coding, data and cloud skills" },
  { emoji: "👩‍🌾", who: "Farmers", what: "teach poultry, dairy and agribusiness" },
  { emoji: "🎨", who: "Designers and creatives", what: "teach design, photography and music" },
  { emoji: "⚖️", who: "Lawyers", what: "teach contracts, rights and governance" },
];

export default function TeachPage() {
  return (
    <>
      <PageHeader
        eyebrow="🎤 Teach on MlimaLMS"
        title="Share what you know. Inspire learners everywhere."
        description="Doctors, accountants, developers, farmers, designers and teachers: turn your experience into an online course and earn while you help others grow."
      >
        <Link
          href="/instructor/courses/new"
          className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
        >
          Create your course
        </Link>
        <Link href="/explore" className={buttonVariants({ size: "lg", variant: "outline" })}>
          See example courses
        </Link>
      </PageHeader>

      <Section>
        <SectionHeading eyebrow="🌍 Experts from every field" title="Who teaches on MlimaLMS?" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example, i) => (
            <Reveal key={example.who} delay={i * 70}>
              <div className="flex h-full items-center gap-4 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="text-4xl">{example.emoji}</span>
                <p className="text-sm">
                  <span className="font-semibold">{example.who}</span>{" "}
                  <span className="text-muted-foreground">{example.what}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="✨ Why teach with us" title="Everything you need to teach online" />
        <div className="mt-12">
          <IconCardGrid items={benefits} />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="⚡️ How it works" title="From idea to published course in four steps" />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} as="li" delay={i * 100}>
              <span className="flex size-12 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white shadow-lg">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="🗂️ Popular fields" title="Teach in any of these categories" />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/explore?category=${category.slug}`}
              className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-green-600/40 hover:shadow-md"
            >
              {category.icon} {category.name}
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-green-600 to-emerald-700 px-6 py-16 text-center text-white sm:px-16">
            <div aria-hidden className="absolute -top-24 -right-24 size-72 animate-float rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">Ready to start teaching?</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-green-50">
              Creating a course is free. You can start now and publish when you are ready.
            </p>
            <Link
              href="/instructor/courses/new"
              className={cn(buttonVariants({ size: "lg" }), "relative mt-8 bg-white text-green-700 hover:bg-green-50")}
            >
              Create your first course
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
