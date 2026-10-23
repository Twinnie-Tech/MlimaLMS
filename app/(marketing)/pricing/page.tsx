import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";
import { CallToAction, Faq, Pricing } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, affordable learning packages for learners, parents and schools.",
};

const comparison: { feature: string; free: boolean | string; learner: boolean | string; schools: boolean | string }[] = [
  { feature: "Sample lessons in every subject", free: true, learner: true, schools: true },
  { feature: "Practice quizzes", free: "10 a week", learner: "Unlimited", schools: "Unlimited" },
  { feature: "Live classes Monday to Friday", free: false, learner: true, schools: true },
  { feature: "Recorded video lessons", free: false, learner: true, schools: true },
  { feature: "KPSEA and KJSEA revision papers", free: false, learner: true, schools: true },
  { feature: "Child report", free: "Basic", learner: "Full", schools: "Full" },
  { feature: "Teacher and admin dashboards", free: false, learner: false, schools: true },
  { feature: "Tablets and mobile data", free: false, learner: false, schools: true },
  { feature: "Priority support", free: false, learner: false, schools: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm">{value}</span>;
  return value ? (
    <Check className="mx-auto size-5 text-green-600" />
  ) : (
    <Minus className="mx-auto size-5 text-muted-foreground/50" />
  );
}

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="💳 Our learning packages"
        title="Learning that fits every budget"
        description="Start for free, upgrade when you are ready. Pay monthly with M-Pesa or card and renew anytime from your child's account."
      />
      <Pricing />

      <Section>
        <h2 className="text-center text-3xl font-bold tracking-tight">Compare packages</h2>
        <Reveal className="mx-auto mt-10 max-w-4xl overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-center">
            <thead className="bg-muted/50 text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Free</th>
                <th className="px-4 py-3 font-semibold text-green-600">Learner</th>
                <th className="px-4 py-3 font-semibold">Schools</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {comparison.map((row) => (
                <tr key={row.feature} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 text-left text-sm">{row.feature}</td>
                  <td className="px-4 py-3"><Cell value={row.free} /></td>
                  <td className="px-4 py-3"><Cell value={row.learner} /></td>
                  <td className="px-4 py-3"><Cell value={row.schools} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      <Faq />
      <CallToAction />
    </>
  );
}
