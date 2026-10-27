"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GitHubButton } from "@/components/auth/github-button"
import { authClient } from "@/lib/auth-client"

export default function SignupPage() {
  const router = useRouter()
  const [signupPending, startSignupTransition] = useTransition()

  function signUpWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get("password"))

    if (password !== String(formData.get("confirmPassword"))) {
      toast.error("Passwords do not match")
      return
    }

    const email = String(formData.get("email"))

    startSignupTransition(async () => {
      await authClient.signUp.email({
        name: String(formData.get("name")),
        email,
        password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account created! Check your email for a verification code.")
            router.push(`/verify-email?email=${encodeURIComponent(email)}`)
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Could not create your account")
          },
        },
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>Start learning with MlimaLMS for free</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <GitHubButton label="Sign up with GitHub" />

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Separator className="flex-1" />
          <span className="shrink-0">Or sign up with email</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={signUpWithEmail} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" placeholder="Jane Wanjiku" autoComplete="name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700"
            disabled={signupPending}
          >
            {signupPending ? (
              <>
                <Loader2 className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:text-green-600 hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
