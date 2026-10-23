import type { Metadata } from "next";

import { contact } from "@/lib/site-config";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How MlimaLMS collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="🔒 Privacy policy"
      title="Privacy policy"
      updated="23 October 2026"
      sections={[
        {
          title: "Information we collect",
          body: [
            "Account details such as your name, email address, phone number and, for parents, your children's names and grades.",
            "Learning activity such as lessons completed, quiz answers, scores and time spent learning.",
          ],
        },
        {
          title: "How we use your information",
          body: [
            "To provide lessons, live classes and revision papers, to create child reports and to personalise learning.",
            "To process payments, send important account updates and respond to support requests.",
          ],
        },
        {
          title: "Children's privacy",
          body: [
            "Children's accounts are created and managed by a parent or guardian. We only collect the information needed to support their learning and never sell it.",
          ],
        },
        {
          title: "Sharing your information",
          body: [
            "We share information only with service providers that help us run MlimaLMS, such as payment and hosting providers, and with your child's school when the school manages the account.",
          ],
        },
        {
          title: "Data security",
          body: [
            "We use encryption, secure hosting and access controls to protect your information.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "In line with the Kenya Data Protection Act, 2019, you can ask to see, correct or delete your personal data at any time.",
          ],
        },
        {
          title: "Contact us",
          body: [`For privacy questions, email ${contact.email}.`],
        },
      ]}
    />
  );
}
