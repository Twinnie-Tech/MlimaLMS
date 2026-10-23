"use client"

import { Suspense, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  ChevronsUpDown,
  Compass,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Loader2,
  LogOut,
  PlusCircle,
  Presentation,
  User,
  Users,
  Video,
} from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Logo } from "@/components/site/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export const dashboardNav = [
  {
    label: "Learn",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "My courses", href: "/courses", icon: BookOpen },
      { title: "Explore courses", href: "/explore", icon: Compass },
      { title: "Live classes", href: "/live-classes", icon: Video, badge: "Live" },
      { title: "Revision", href: "/revision", icon: FileText },
    ],
  },
  {
    label: "Teach",
    items: [
      { title: "Instructor dashboard", href: "/instructor", icon: Presentation },
      { title: "Create course", href: "/instructor/courses/new", icon: PlusCircle },
    ],
  },
  {
    label: "Family",
    items: [{ title: "My children", href: "/children", icon: Users }],
  },
  {
    label: "Account",
    items: [
      { title: "Billing", href: "/billing", icon: CreditCard },
      { title: "Profile", href: "/profile", icon: User },
    ],
  },
]

export function findActiveNavItem(pathname: string) {
  return dashboardNav
    .flatMap((group) => group.items)
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function NavUser() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [signOutPending, startSignOutTransition] = useTransition()

  function signOut() {
    startSignOutTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("You have been signed out")
            router.push("/login")
            router.refresh()
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Sign out failed")
          },
        },
      })
    })
  }

  if (isPending || !session) {
    return (
      <div className="flex h-12 items-center gap-2 px-2">
        <Skeleton className="size-8 rounded-lg" />
        <div className="flex flex-1 flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-32" />
        </div>
      </div>
    )
  }

  const { user } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<SidebarMenuButton size="lg" className="data-popup-open:bg-sidebar-accent" />}
      >
        <Avatar className="size-8 rounded-lg after:rounded-lg">
          {user.image && <AvatarImage src={user.image} alt={user.name} className="rounded-lg" />}
          <AvatarFallback className="rounded-lg">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </span>
        <ChevronsUpDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-(--anchor-width) min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />}>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/billing" />}>
          <CreditCard />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/" />}>
          <Home />
          Back to website
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={signOutPending} onClick={signOut}>
          {signOutPending ? <Loader2 className="animate-spin" /> : <LogOut />}
          {signOutPending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ActiveSidebarNav() {
  return <SidebarNav activeHref={findActiveNavItem(usePathname())?.href} />
}

function SidebarNav({ activeHref }: { activeHref?: string }) {
  return (
    <>
      {dashboardNav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={item.href === activeHref}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {"badge" in item && item.badge && (
                      <SidebarMenuBadge className="bg-red-500/10 text-red-600">{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
    </>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b px-4 group-data-[collapsible=icon]:px-2">
        <Logo className="group-data-[collapsible=icon]:[&>span:last-child]:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<SidebarNav />}>
          <ActiveSidebarNav />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
