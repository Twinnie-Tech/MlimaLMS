import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { mainNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { Features } from "@/components/site/features";
import { CallToAction, HowItWorks, SubjectsMarquee } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "Our product",
  description: "Live classes, revision, child reports, languages and school packages in one learning platform.",
};

const productLinks =
  mainNav.find((group) => group.label === "Product")?.items?.filter((item) => item.href !== "/product") ?? [];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="📦 Our product"
        title="Everything you need to learn, teach and track progress"
        description="MlimaLMS has been designed to improve the learning and teaching process, with a large library of learning materials and support for learners to solve questions."
      >
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
        >
          Sign up now
        </Link>
        <Link href="/pricing" className={buttonVariants({ size: "lg", variant: "outline" })}>
          See pricing
        </Link>
      </PageHeader>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {productLinks.map((item, i) => (
            <Reveal key={item.href} delay={i * 70}>
              <Link
                href={item.href}
                className="group flex h-full items-start gap-4 rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-lg"
              >
                {item.icon && (
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-600/10 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                    <item.icon className="size-5" />
                  </span>
                )}
                <span className="flex-1">
                  <span className="block font-semibold">{item.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
                  <span className="mt-3 flex items-center gap-1 text-sm font-medium text-green-600">
                    Find out more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <SubjectsMarquee />
      <Features />
      <HowItWorks />
      <CallToAction />
    </>
  );
}
