"use client"

import { useTransition } from "react"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

const notificationOptions = [
  { id: "weekly-report", label: "Weekly child report", description: "A summary of progress every Sunday." },
  { id: "class-reminders", label: "Live class reminders", description: "A reminder 15 minutes before each class." },
  { id: "payment-reminders", label: "Payment reminders", description: "A reminder 3 days before your package renews." },
]

export function ProfileForm() {
  const { data: session, isPending, refetch } = authClient.useSession()
  const [savePending, startSaveTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = String(new FormData(event.currentTarget).get("name"))

    startSaveTransition(async () => {
      await authClient.updateUser({
        name,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Profile updated")
            refetch()
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Could not update your profile")
          },
        },
      })
    })
  }

  if (isPending || !session) {
    return <Skeleton className="h-96 w-full rounded-xl" />
  }

  const { user } = session

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your name. Your email is used to log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString("en-KE", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" defaultValue={user.name} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email} disabled />
              </div>
            </div>
            <Button
              type="submit"
              disabled={savePending}
              className="w-fit bg-green-600 text-white hover:bg-green-700"
            >
              {savePending ? <Loader2 className="animate-spin" /> : <Save />}
              {savePending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what we send to {user.email}.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {notificationOptions.map((option) => (
            <label key={option.id} htmlFor={option.id} className="flex cursor-pointer items-start gap-3">
              <Checkbox id={option.id} defaultChecked className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-xs text-muted-foreground">{option.description}</span>
              </span>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
