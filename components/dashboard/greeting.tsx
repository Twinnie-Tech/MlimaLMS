"use client"

import { authClient } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"

export function Greeting() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <Skeleton className="h-8 w-64" />

  const firstName = session?.user.name.split(" ")[0] ?? "there"

  return (
    <h2 className="text-2xl font-bold tracking-tight">
      Welcome back, {firstName} 👋
    </h2>
  )
}
