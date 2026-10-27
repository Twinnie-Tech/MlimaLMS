"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { getCallbackUrl } from "@/lib/callback-url"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OTP_LENGTH, OtpCodeInput, useResendCooldown } from "@/components/auth/otp-code-input"

export function EmailOtpSignIn() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")
  const [pending, startTransition] = useTransition()
  const cooldown = useResendCooldown()

  function sendCode() {
    startTransition(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" })
      if (error) {
        toast.error(error.message || "Could not send the code")
        return
      }
      toast.success(`We sent a ${OTP_LENGTH}-digit code to ${email}`)
      setOtp("")
      setStep("code")
      cooldown.start()
    })
  }

  function verify(code: string) {
    startTransition(async () => {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp: code,
        name: email.split("@")[0],
      })
      if (error) {
        toast.error(error.message || "Invalid or expired code")
        setOtp("")
        return
      }
      toast.success("Welcome to MlimaLMS!")
      router.push(getCallbackUrl())
    })
  }

  if (step === "email") {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendCode()
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="otp-email">Email</Label>
          <Input
            id="otp-email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Mail />}
          {pending ? "Sending code..." : "Email me a code"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          No password needed. New here? We will create your account.
        </p>
      </form>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        verify(otp)
      }}
      className="flex flex-col gap-4"
    >
      <p className="text-center text-sm text-muted-foreground">
        Enter the code sent to <span className="font-medium text-foreground">{email}</span>
      </p>
      <OtpCodeInput value={otp} onChange={setOtp} onComplete={verify} disabled={pending} />
      <Button type="submit" className="w-full" disabled={pending || otp.length < OTP_LENGTH}>
        {pending && <Loader2 className="animate-spin" />}
        {pending ? "Verifying..." : "Sign in"}
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
          onClick={sendCode}
          disabled={pending || cooldown.remaining > 0}
          className="text-green-600 hover:underline disabled:text-muted-foreground disabled:no-underline"
        >
          {cooldown.remaining > 0 ? `Resend in ${cooldown.remaining}s` : "Resend code"}
        </button>
      </div>
    </form>
  )
}
