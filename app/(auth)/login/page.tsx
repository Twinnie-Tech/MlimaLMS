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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailOtpSignIn } from "@/components/auth/email-otp-sign-in"
import { GitHubButton } from "@/components/auth/github-button"
import { authClient } from "@/lib/auth-client"
import { getCallbackUrl } from "@/lib/callback-url"

export default function LoginPage() {
  const router = useRouter()
  const [emailPending, startEmailTransition] = useTransition()

  function signInWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startEmailTransition(async () => {
      await authClient.signIn.email({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        fetchOptions: {
          onSuccess: () => {
            toast.success("Welcome back!")
            router.push(getCallbackUrl())
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Invalid email or password")
          },
        },
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>Log in with your GitHub or email account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <GitHubButton label="Sign in with GitHub" />

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Separator className="flex-1" />
          <span className="shrink-0">Or continue with</span>
          <Separator className="flex-1" />
        </div>

        <Tabs defaultValue="code">
          <TabsList className="w-full">
            <TabsTrigger value="code">Email code</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-4">
            <EmailOtpSignIn />
          </TabsContent>
          <TabsContent value="password" className="mt-4">
            <form onSubmit={signInWithEmail} className="flex flex-col gap-4">
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
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-green-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={emailPending}>
                {emailPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Continue with Email"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:text-green-600 hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
