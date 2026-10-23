"use client"

import { Suspense, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Presentation,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { mainNav } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/site/logo"
import { ModeToggle } from "@/components/ui/themetoggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false
  const path = href.split(/[?#]/)[0]
  return path === "/" ? pathname === "/" : pathname.startsWith(path)
}

function ActiveDesktopNav() {
  return <DesktopNav pathname={usePathname()} />
}

function DesktopNav({ pathname }: { pathname: string | null }) {
  return (
    <nav className="hidden items-center gap-0.5 lg:flex">
      {mainNav.map((group) => {
        if (!group.items) {
          return (
            <Link
              key={group.label}
              href={group.href!}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive(pathname, group.href!) && "text-foreground"
              )}
            >
              {group.label}
            </Link>
          )
        }

        const groupActive = group.items.some((item) => isActive(pathname, item.href))

        return (
          <DropdownMenu key={group.label}>
            <DropdownMenuTrigger
              openOnHover
              delay={60}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground data-popup-open:text-foreground [&[data-popup-open]>svg]:rotate-180",
                groupActive && "text-foreground"
              )}
            >
              {group.label}
              <ChevronDown className="size-4 transition-transform duration-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={8} className="w-80 p-2">
              {group.items.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  render={<Link href={item.href} />}
                  className="items-start gap-3 p-2"
                >
                  {item.icon && (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-600/10 text-green-600">
                      <item.icon className="size-4" />
                    </span>
                  )}
                  <span className="flex flex-col">
                    <span className="font-medium">{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      })}
    </nav>
  )
}

type SessionUser = {
  name: string
  email: string
  image?: string | null
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function UserAvatar({ user, size = "default" }: { user: SessionUser; size?: "default" | "sm" | "lg" }) {
  return (
    <Avatar size={size}>
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback>{initials(user.name)}</AvatarFallback>
    </Avatar>
  )
}

function useSignOut() {
  const router = useRouter()
  const [signOutPending, startSignOutTransition] = useTransition()

  function signOut() {
    startSignOutTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("You have been signed out")
            router.push("/")
            router.refresh()
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Sign out failed")
          },
        },
      })
    })
  }

  return { signOut, signOutPending }
}

function UserMenu({ user }: { user: SessionUser }) {
  const { signOut, signOutPending } = useSignOut()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-10 gap-2 rounded-full pr-2 pl-1" />}
      >
        <UserAvatar user={user} />
        <span className="hidden max-w-32 truncate text-sm font-medium lg:inline">
          {user.name}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
            <UserAvatar user={user} size="lg" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboard />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/courses" />}>
            <BookOpen />
            My courses
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/instructor" />}>
            <Presentation />
            Teaching
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/profile" />}>
            <User />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={signOutPending}
          onClick={signOut}
        >
          {signOutPending ? <Loader2 className="animate-spin" /> : <LogOut />}
          {signOutPending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileMenu({ user }: { user: SessionUser | null }) {
  const { signOut, signOutPending } = useSignOut()

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" size="icon" className="lg:hidden" />}
      >
        <Menu />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle render={<div />}>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        {user && (
          <div className="mx-4 flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
            <UserAvatar user={user} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
          </div>
        )}

        <nav className="flex flex-col gap-4 overflow-y-auto px-2">
          {mainNav.map((group) =>
            group.items ? (
              <div key={group.label} className="flex flex-col">
                <span className="px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {group.label}
                </span>
                {group.items.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={<Link href={item.href} />}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {item.icon && <item.icon className="size-4 text-green-600" />}
                    {item.label}
                  </SheetClose>
                ))}
              </div>
            ) : (
              <SheetClose
                key={group.label}
                render={<Link href={group.href!} />}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {group.label}
              </SheetClose>
            )
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-2 p-4">
          {user ? (
            <>
              <Link href="/dashboard" className={buttonVariants()}>
                <LayoutDashboard />
                Dashboard
              </Link>
              <Button variant="outline" onClick={signOut} disabled={signOutPending}>
                {signOutPending ? <Loader2 className="animate-spin" /> : <LogOut />}
                {signOutPending ? "Signing out..." : "Sign out"}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants(), "bg-green-600 text-white hover:bg-green-700")}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const user = session?.user ?? null

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/80 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <Suspense fallback={<DesktopNav pathname={null} />}>
          <ActiveDesktopNav />
        </Suspense>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {isPending ? (
            <Skeleton className="hidden h-10 w-32 rounded-full lg:block" />
          ) : user ? (
            <div className="hidden lg:block">
              <UserMenu user={user} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants(), "bg-green-600 text-white hover:bg-green-700")}
              >
                Sign up
              </Link>
            </div>
          )}
          {user && (
            <div className="lg:hidden">
              <UserAvatar user={user} />
            </div>
          )}
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  )
}
