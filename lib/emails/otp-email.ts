import { renderEmail } from "@/lib/emails/layout"

export type OtpType = "sign-in" | "email-verification" | "forget-password" | "change-email"

const copy: Record<OtpType, { subject: string; heading: string; intro: string }> = {
  "sign-in": {
    subject: "Your MlimaLMS sign-in code",
    heading: "Sign in to MlimaLMS",
    intro: "Use this code to sign in to your account.",
  },
  "email-verification": {
    subject: "Verify your email for MlimaLMS",
    heading: "Verify your email",
    intro: "Use this code to confirm your email address and finish setting up your account.",
  },
  "forget-password": {
    subject: "Reset your MlimaLMS password",
    heading: "Reset your password",
    intro: "Use this code to set a new password for your account.",
  },
  "change-email": {
    subject: "Confirm your new email for MlimaLMS",
    heading: "Confirm your new email",
    intro: "Use this code to confirm the new email address on your account.",
  },
}

export function otpEmail({ otp, type, minutes }: { otp: string; type: OtpType; minutes: number }) {
  const { subject, heading, intro } = copy[type] ?? copy["sign-in"]

  return renderEmail({
    subject,
    preheader: `Your code is ${otp}`,
    heading,
    blocks: [
      { type: "text", content: intro },
      { type: "code", content: otp },
    ],
    footnote: `This code expires in ${minutes} minutes. If you did not request it, you can safely ignore this email.`,
  })
}
