import type { Metadata } from "next";
import { Download, FileText, Smartphone } from "lucide-react";

import { downloads } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download the MlimaLMS app, timetables, sample papers and guides.",
};

export default function DownloadsPage() {
  return (
    <>
      <PageHeader
        eyebrow="⬇️ Downloads"
        title="Apps, timetables and resources"
        description="Everything you need to get the most from MlimaLMS, free to download."
      />

      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-green-600 to-emerald-700 p-8 text-white sm:p-12">
            <div aria-hidden className="absolute -top-16 -right-16 size-64 animate-float rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-white/15">
                  <Smartphone className="size-8" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold">Download our app</h2>
                  <p className="mt-1 text-green-50">
                    The MlimaLMS Android app is coming soon to the Google Play Store, free.
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-green-700">
                Coming soon on Google Play
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {downloads.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="flex h-full items-start gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-green-600/40 hover:shadow-md">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-600/10 text-green-600">
                  {item.type === "App" ? <Smartphone className="size-5" /> : <FileText className="size-5" />}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant="secondary">{item.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.size}</p>
                </div>
                <a
                  href={item.href}
                  aria-disabled={item.href === "#"}
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }), "shrink-0")}
                >
                  <Download />
                  <span className="sr-only">Download {item.title}</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
