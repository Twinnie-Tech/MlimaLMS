"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/themetoggle"
import { findActiveNavItem } from "@/components/dashboard/app-sidebar"

function PageName() {
  return <>{findActiveNavItem(usePathname())?.title ?? "Dashboard"}</>
}

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 h-4" />
      <h1 className="text-sm font-medium">
        <Suspense fallback="Dashboard">
          <PageName />
        </Suspense>
      </h1>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative">
          <Bell />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-green-600" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}
