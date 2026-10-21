import Link from "next/link"
import { ArrowLeft, MountainSnow } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/themetoggle"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-4 left-4"
        )}
      >
        <ArrowLeft />
        Back
      </Link>

      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 self-center font-medium"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-green-600 text-white">
            <MountainSnow className="size-5" />
          </span>
          MlimaLMS.
        </Link>

        {children}

        <p className="text-center text-xs text-balance text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Terms of service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default AuthLayout
