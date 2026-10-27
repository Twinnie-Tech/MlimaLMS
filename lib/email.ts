import { after } from "next/server"
import nodemailer, { type Transporter } from "nodemailer"
import { Resend } from "resend"

import { env } from "@/lib/env"

type Email = { to: string; subject: string; html: string; text: string }

let resend: Resend | undefined
let smtp: Transporter | undefined

function smtpConfigured() {
  return Boolean(env.SMTP_PASS && (env.SMTP_USER ?? env.SMTP_FROM))
}

async function sendWithResend({ to, subject, html, text }: Email) {
  resend ??= new Resend(env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `${env.EMAIL_FROM_NAME} <${env.RESEND_FROM}>`,
    to,
    subject,
    html,
    text,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}

async function sendWithSmtp({ to, subject, html, text }: Email) {
  smtp ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER ?? env.SMTP_FROM, pass: env.SMTP_PASS },
  })
  await smtp.sendMail({
    from: `"${env.EMAIL_FROM_NAME}" <${env.SMTP_FROM ?? env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  })
}

export async function sendEmail(email: Email) {
  if (env.RESEND_API_KEY) {
    try {
      await sendWithResend(email)
      return
    } catch (error) {
      // Without a verified domain Resend only delivers to the account owner, so fall back to SMTP.
      if (!smtpConfigured()) throw error
      console.warn(`[email] ${(error as Error).message}. Falling back to SMTP.`)
    }
  }

  if (smtpConfigured()) {
    await sendWithSmtp(email)
    return
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[email] No email provider configured. To: ${email.to} | ${email.subject}\n${email.text}`)
    return
  }
  throw new Error("No email provider configured. Set RESEND_API_KEY or SMTP_PASS.")
}

// Seeded demo instructors use placeholder addresses that cannot receive mail.
const undeliverable = /\.demo@mlimalms\.com$/i

/** Sends after the response is returned, so slow providers never delay the user. */
export function sendEmailInBackground(email: Email, label: string) {
  if (undeliverable.test(email.to)) return
  after(() =>
    sendEmail(email).catch((error) => console.error(`[email] Failed to send ${label}`, error))
  )
}
