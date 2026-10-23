import type { Metadata } from "next";

import { contact } from "@/lib/site-config";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use MlimaLMS.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="📄 Terms of use"
      title="Terms of use"
      updated="23 October 2026"
      sections={[
        {
          title: "Acceptance of terms",
          body: [
            "By creating an account or using MlimaLMS, you agree to these terms. If you do not agree, please do not use the service.",
            "If you are registering on behalf of a child, you confirm that you are their parent or guardian and accept these terms for them.",
          ],
        },
        {
          title: "Your account",
          body: [
            "You are responsible for keeping your login details safe and for all activity on your account.",
            "Please give accurate information when you register and keep it up to date.",
          ],
        },
        {
          title: "Subscriptions and payments",
          body: [
            "Paid packages are billed in advance for the period you choose. You can renew or cancel at any time from your account.",
            "Payments already made for an active period are not refundable, except where required by law.",
          ],
        },
        {
          title: "Acceptable use",
          body: [
            "Use MlimaLMS for learning only. Do not share your account, copy or resell our content, or disrupt live classes.",
            "We may suspend accounts that break these rules.",
          ],
        },
        {
          title: "Content and intellectual property",
          body: [
            "All lessons, videos, papers and other materials on MlimaLMS belong to MlimaLMS or its partners and are licensed to you for personal learning only.",
          ],
        },
        {
          title: "Changes to these terms",
          body: [
            "We may update these terms from time to time. We will let you know about important changes by email or in the app.",
          ],
        },
        {
          title: "Contact us",
          body: [`Questions about these terms? Email ${contact.email} or call ${contact.phone}.`],
        },
      ]}
    />
  );
}
