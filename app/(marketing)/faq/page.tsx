import type { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { Faq } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about MlimaLMS.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="📪 FAQs"
        title="Frequently asked questions"
        description="Everything you need to know about learning, teaching and paying on MlimaLMS."
      />
      <Faq />
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold">Still have questions?</h2>
        <p className="mt-2 text-muted-foreground">Our customer care team is happy to help.</p>
        <Link
          href="/support"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 bg-green-600 text-white hover:bg-green-700")}
        >
          Contact customer care
        </Link>
      </section>
    </>
  );
}
