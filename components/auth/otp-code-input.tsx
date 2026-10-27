"use client"

import { useEffect, useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export const OTP_LENGTH = 6

export function OtpCodeInput({
  value,
  onChange,
  onComplete,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
}) {
  return (
    <InputOTP
      maxLength={OTP_LENGTH}
      pattern={REGEXP_ONLY_DIGITS}
      value={value}
      onChange={onChange}
      onComplete={onComplete}
      disabled={disabled}
      autoFocus
      containerClassName="justify-center"
    >
      <InputOTPGroup>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <InputOTPSlot key={i} index={i} className="size-11 text-lg" />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}

export function useResendCooldown(seconds = 30) {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (remaining <= 0) return
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining])

  return { remaining, start: () => setRemaining(seconds) }
}
