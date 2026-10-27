"use client"

import { useTransition } from "react"
import Link from "next/link"
import { KeyRound, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ChangePasswordForm() {
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const newPassword = String(formData.get("newPassword"))

    if (newPassword !== String(formData.get("confirmPassword"))) {
      toast.error("New passwords do not match")
      return
    }

    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword: String(formData.get("currentPassword")),
        newPassword,
        revokeOtherSessions: true,
      })
      if (error) {
        toast.error(error.message || "Could not change your password")
        return
      }
      form.reset()
      toast.success("Password updated. We have emailed you a confirmation.")
    })
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          You will stay signed in here and be signed out on other devices. Signed up with an email
          code or GitHub?{" "}
          <Link href="/forgot-password" className="text-green-600 underline-offset-4 hover:underline">
            Set a password
          </Link>{" "}
          instead.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:max-w-sm">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
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
          </div>
          <Button type="submit" variant="outline" disabled={pending} className="w-fit">
            {pending ? <Loader2 className="animate-spin" /> : <KeyRound />}
            {pending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
