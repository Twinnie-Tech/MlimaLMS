import type { Metadata } from "next";
import {
  BarChart3,
  GraduationCap,
  Headset,
  LayoutDashboard,
  ShieldCheck,
  WifiOff,
} from "lucide-react";

import { contact } from "@/lib/site-config";
import { PageHeader, SectionHeading } from "@/components/site/page-header";
import { CheckList, IconCardGrid, Section } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";
import { Schools } from "@/components/site/features";

export const metadata: Metadata = {
  title: "For schools",
  description: "The MlimaLMS complete ICT learning package: tablets, LMS software, data and training.",
};

const benefits = [
  { icon: LayoutDashboard, title: "Teacher dashboard", text: "Assign work, run live lessons and mark quizzes automatically." },
  { icon: BarChart3, title: "School reports", text: "See performance by class, subject and learner in real time." },
  { icon: GraduationCap, title: "KICD-approved content", text: "Hundreds of thousands of resources from Grade 1 to Grade 9." },
  { icon: WifiOff, title: "Works offline", text: "Lessons are downloaded to tablets so learning continues without internet." },
  { icon: ShieldCheck, title: "Safe for learners", text: "A controlled learning environment with no distracting apps." },
  { icon: Headset, title: "Training and support", text: "On-site teacher training and a dedicated support line." },
];

export default function SchoolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="🏫 MlimaLMS for schools"
        title="The complete ICT learning package"
        description="A high quality 10 inch tablet with a detachable keyboard, the MlimaLMS learning management system and one year of mobile internet, for every learner in your school."
      >
        <a
          href="#demo"
          className="inline-flex h-10 items-center rounded-lg bg-green-600 px-6 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Request a demo
        </a>
      </PageHeader>

      <Schools />

      <Section>
        <SectionHeading eyebrow="📋 What schools get" title="Everything you need to go digital" />
        <div className="mt-12">
          <IconCardGrid items={benefits} />
        </div>
      </Section>

      <Section id="demo" muted>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-medium text-green-600">📅 Request a demo</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">See MlimaLMS in your school</h2>
            <p className="mt-4 text-muted-foreground">
              Our schools team will visit your school, show your teachers how MlimaLMS works
              and prepare a package that fits your learners and budget.
            </p>
            <CheckList
              className="mt-6"
              items={[
                "Free on-site demonstration",
                "Flexible payment plans for schools",
                "Packages for any number of learners",
              ]}
            />
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer to talk? Call us on <span className="font-medium text-foreground">{contact.phone}</span>{" "}
              or email <span className="font-medium text-foreground">{contact.email}</span>.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <ContactForm variant="demo" />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
