import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  PlayCircle,
  Search,
  Trophy,
  Video,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

const weeklyLessons = [
  { day: "M", value: 60 },
  { day: "T", value: 85 },
  { day: "W", value: 45 },
  { day: "T", value: 90 },
  { day: "F", value: 70 },
  { day: "S", value: 35 },
  { day: "S", value: 20 },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(22_163_74/0.15),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-60"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-2 lg:pt-20 lg:pb-28">
        <div className="flex flex-col items-start gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Badge
            variant="outline"
            className="h-auto gap-2 rounded-full border-green-600/30 bg-green-600/10 px-3 py-1 text-green-700 dark:text-green-400"
          >
            🌍 Courses in tech, health, finance, farming, school and more
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Learn anything.{" "}
            <span className="bg-linear-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
              Teach what you know.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            From coding and first aid to accounting, poultry farming and CBC
            revision, learn from Kenyan experts who do the work every day. Or
            share your own skills, publish a course and earn from every student.
          </p>

          <form action="/explore" className="relative w-full max-w-lg">
            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              placeholder="What do you want to learn today?"
              className="h-12 w-full rounded-full border bg-background pr-28 pl-12 text-base shadow-sm outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-green-600/30"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-1.5 h-9 -translate-y-1/2 rounded-full bg-green-600 px-5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/explore"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group bg-green-600 text-white hover:bg-green-700"
              )}
            >
              Explore courses
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/teach" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Teach on MlimaLMS
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["Free and paid courses", "Learn at your own pace", "Works on phone and tablet"].map(
              (item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-green-600" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <HeroDashboard />
      </div>
    </section>
  )
}

function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-md animate-in fade-in zoom-in-95 duration-1000 lg:max-w-none">
      <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-green-900/5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Lessons completed this week</p>
            <p className="mt-1 text-3xl font-bold">
              128{" "}
              <span className="text-sm font-medium text-green-600">▲ 18%</span>
            </p>
          </div>
          <Badge className="bg-green-600/10 text-green-700 dark:text-green-400">
            Grade 6
          </Badge>
        </div>

        <div className="mt-6 flex h-32 items-end justify-between gap-3">
          {weeklyLessons.map((bar, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end">
                <div
                  className="w-full origin-bottom animate-grow-bar rounded-t-md bg-linear-to-t from-green-600 to-emerald-400"
                  style={{ height: `${bar.value}%`, animationDelay: `${300 + i * 90}ms` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{bar.day}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Lessons", value: "42" },
            { label: "Quizzes", value: "16" },
            { label: "Avg score", value: "78%" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-muted/60 p-3">
              <p className="text-lg font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border p-3">
          <span className="relative flex size-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
            <Video className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Live now · Mathematics</p>
            <p className="truncate text-xs text-muted-foreground">
              Fractions and decimals · Tr. Wanjiku · 6:00 PM
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium text-white">
            <PlayCircle className="size-3.5" />
            Join
          </span>
        </div>
      </div>

      <div className="absolute -top-14 -left-4 hidden animate-float rounded-xl border bg-card p-3 shadow-lg sm:block lg:-left-10">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
            <Trophy className="size-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">KPSEA mock</p>
            <p className="text-sm font-semibold">Scored 82%</p>
          </div>
        </div>
      </div>

      <div
        className="absolute -right-4 -bottom-6 hidden animate-float rounded-xl border bg-card p-3 shadow-lg sm:block lg:-right-8"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600">
            <Clock className="size-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Next class</p>
            <p className="text-sm font-semibold">Kiswahili · 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
