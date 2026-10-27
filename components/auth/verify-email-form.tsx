"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, MailCheck } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OTP_LENGTH, OtpCodeInput, useResendCooldown } from "@/components/auth/otp-code-input"

export function VerifyEmailForm({ email }: { email: string }) {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [pending, startTransition] = useTransition()
  const cooldown = useResendCooldown()

  function verify(code: string) {
    startTransition(async () => {
      const { error } = await authClient.emailOtp.verifyEmail({ email, otp: code })
      if (error) {
        toast.error(error.message || "Invalid or expired code")
        setOtp("")
        return
      }
      toast.success("Email verified. Welcome to MlimaLMS!")
      router.push("/dashboard")
      router.refresh()
    })
  }

  function resend() {
    startTransition(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      })
      if (error) {
        toast.error(error.message || "Could not send the code")
        return
      }
      toast.success("A new code is on its way")
      cooldown.start()
    })
  }

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-600/10 text-green-600">
          <MailCheck className="size-6" />
        </span>
        <CardTitle className="text-xl">Check your email</CardTitle>
        <CardDescription>
          We sent a {OTP_LENGTH}-digit code to{" "}
          <span className="font-medium text-foreground">{email || "your email"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            verify(otp)
          }}
          className="flex flex-col gap-4"
        >
          <OtpCodeInput value={otp} onChange={setOtp} onComplete={verify} disabled={pending || !email} />
          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700"
            disabled={pending || otp.length < OTP_LENGTH || !email}
          >
            {pending && <Loader2 className="animate-spin" />}
            {pending ? "Verifying..." : "Verify email"}
          </Button>
        </form>
        <div className="flex items-center justify-between text-sm">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Skip for now
          </Link>
          <button
            type="button"
            onClick={resend}
            disabled={pending || cooldown.remaining > 0 || !email}
            className="text-green-600 hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            {cooldown.remaining > 0 ? `Resend in ${cooldown.remaining}s` : "Resend code"}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
