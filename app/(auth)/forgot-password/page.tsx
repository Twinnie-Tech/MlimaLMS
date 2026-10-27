"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OTP_LENGTH, OtpCodeInput, useResendCooldown } from "@/components/auth/otp-code-input"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "reset">("email")
  const [pending, startTransition] = useTransition()
  const cooldown = useResendCooldown()

  function requestCode() {
    startTransition(async () => {
      const { error } = await authClient.emailOtp.requestPasswordReset({ email })
      if (error) {
        toast.error(error.message || "Could not send the code")
        return
      }
      toast.success("If an account exists for this email, we sent a reset code.")
      setOtp("")
      setStep("reset")
      cooldown.start()
    })
  }

  function resetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get("password"))

    if (password !== String(formData.get("confirmPassword"))) {
      toast.error("Passwords do not match")
      return
    }

    startTransition(async () => {
      const { error } = await authClient.emailOtp.resetPassword({ email, otp, password })
      if (error) {
        toast.error(error.message || "Invalid or expired code")
        return
      }
      toast.success("Password updated. You can now log in.")
      router.push("/login")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription>
          {step === "email"
            ? "Enter your email and we will send you a reset code."
            : `Enter the ${OTP_LENGTH}-digit code sent to ${email} and choose a new password.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {step === "email" ? (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              requestCode()
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <KeyRound />}
              {pending ? "Sending code..." : "Send reset code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="flex flex-col gap-4">
            <OtpCodeInput value={otp} onChange={setOtp} disabled={pending} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 text-white hover:bg-green-700"
              disabled={pending || otp.length < OTP_LENGTH}
            >
              {pending && <Loader2 className="animate-spin" />}
              {pending ? "Updating..." : "Update password"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Change email
              </button>
              <button
                type="button"
                onClick={requestCode}
                disabled={pending || cooldown.remaining > 0}
                className="text-green-600 hover:underline disabled:text-muted-foreground disabled:no-underline"
              >
                {cooldown.remaining > 0 ? `Resend in ${cooldown.remaining}s` : "Resend code"}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:text-green-600 hover:underline">
            Back to login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
