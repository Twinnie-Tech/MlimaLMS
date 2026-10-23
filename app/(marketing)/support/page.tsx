import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { contact } from "@/lib/site-config";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Customer care",
  description: "Get help from the MlimaLMS customer care team.",
};

const channels = [
  { icon: Phone, title: "Call us", value: contact.phone, text: "Talk to a member of our team." },
  { icon: MessageCircle, title: "WhatsApp", value: contact.whatsapp, text: "Chat with us on WhatsApp." },
  { icon: Mail, title: "Email", value: contact.email, text: "We reply within 24 hours." },
  { icon: MapPin, title: "Visit us", value: contact.address, text: "Our office is open on weekdays." },
];

export default function SupportPage() {
  return (
    <>
      <PageHeader
        eyebrow="💬 Customer care"
        title="Have a question? We are here to help"
        description="Our customer care team helps learners, parents, teachers and schools every day."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, i) => (
            <Reveal key={channel.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-lg">
                <span className="flex size-11 items-center justify-center rounded-xl bg-green-600/10 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <channel.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{channel.title}</h3>
                <p className="mt-1 text-sm font-medium">{channel.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{channel.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-medium text-green-600">✉️ Send us a message</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">We would love to hear from you</h2>
            <p className="mt-4 text-muted-foreground">
              Questions about classes, payments, your child&apos;s account or partnering with us?
              Send us a message and we will get back to you.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
              <Clock className="size-5 text-green-600" />
              <span>
                <span className="font-medium">Working hours: </span>
                {contact.hours}
              </span>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Looking for a quick answer? Check our{" "}
              <Link href="/faq" className="font-medium text-green-600 underline-offset-4 hover:underline">
                frequently asked questions
              </Link>
              .
            </p>
          </Reveal>
          <Reveal delay={150}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
