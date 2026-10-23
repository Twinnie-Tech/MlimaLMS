import type { Metadata } from "next";
import Link from "next/link";
import { Award, Headphones, MessagesSquare, UserCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader, SectionHeading } from "@/components/site/page-header";
import { CheckList, IconCardGrid, Section } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";
import { CallToAction } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "School of Languages",
  description: "Learn French, German, Chinese, Kiswahili and English with expert tutors.",
};

const languages = [
  { flag: "🇫🇷", name: "French", levels: "A1 to B2", text: "From greetings to confident conversation, with DELF exam preparation." },
  { flag: "🇩🇪", name: "German", levels: "A1 to B2", text: "Grammar, vocabulary and speaking practice with Goethe exam preparation." },
  { flag: "🇨🇳", name: "Chinese", levels: "HSK 1 to 4", text: "Mandarin speaking, listening and characters for beginners and beyond." },
  { flag: "🇰🇪", name: "Kiswahili", levels: "Beginner to Fasihi", text: "Sarufi, insha and fasihi for learners and adults who want to master Kiswahili." },
  { flag: "🇬🇧", name: "English", levels: "Beginner to advanced", text: "Grammar, composition and public speaking for every age." },
  { flag: "🇪🇸", name: "Spanish", levels: "A1 to B1", text: "Learn one of the world's most spoken languages from scratch." },
];

const benefits = [
  { icon: UserCheck, title: "Expert tutors", text: "Native and fluent speakers who are trained language teachers." },
  { icon: Headphones, title: "Audio lessons", text: "Practise listening and pronunciation anytime." },
  { icon: MessagesSquare, title: "Conversation classes", text: "Small live groups where you speak from day one." },
  { icon: Award, title: "Certificates", text: "Earn a certificate each time you complete a level." },
];

export default function LanguagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="🌍 MlimaLMS School of Languages"
        title="Speak a new language with confidence"
        description="Beginner to advanced language courses for children and adults, taught live by expert tutors."
      >
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
        >
          Start learning
        </Link>
      </PageHeader>

      <Section>
        <SectionHeading eyebrow="🗣️ Our languages" title="Choose your language" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((language, i) => (
            <Reveal key={language.name} delay={i * 80}>
              <div className="group h-full rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{language.flag}</span>
                  <Badge variant="secondary">{language.levels}</Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{language.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{language.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="✨ How you learn" title="A complete language experience" />
        <div className="mt-12">
          <IconCardGrid items={benefits} columns={4} />
        </div>
      </Section>

      <Section>
        <Reveal className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-center">
          <h2 className="text-2xl font-bold">Language courses from KSh 1,500 per month</h2>
          <p className="mt-2 text-muted-foreground">Two live classes a week plus unlimited practice.</p>
          <CheckList
            className="mx-auto mt-6 w-fit text-left"
            items={["Placement test to find your level", "Live classes and recordings", "Certificate for each level"]}
          />
        </Reveal>
      </Section>

      <CallToAction />
    </>
  );
}
