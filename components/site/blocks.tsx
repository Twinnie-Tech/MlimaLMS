import { CheckCircle2, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Reveal } from "@/components/site/reveal"

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3 text-sm", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function IconCardGrid({
  items,
  columns = 3,
}: {
  items: { icon: LucideIcon; title: string; text: string }[]
  columns?: 2 | 3 | 4
}) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4"
      )}
    >
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 80}>
          <div className="group h-full rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-lg">
            <span className="flex size-11 items-center justify-center rounded-xl bg-green-600/10 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
              <item.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export function Section({
  id,
  muted,
  children,
  className,
}: {
  id?: string
  muted?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-20 sm:py-24", muted && "bg-muted/40", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  )
}
