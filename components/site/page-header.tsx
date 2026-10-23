import { Badge } from "@/components/ui/badge"

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  description?: string
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(22_163_74/0.15),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-60"
      />
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 sm:px-6 sm:py-24">
        <Badge
          variant="outline"
          className="h-auto rounded-full border-green-600/30 bg-green-600/10 px-3 py-1 text-green-700 dark:text-green-400"
        >
          {eyebrow}
        </Badge>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-medium text-green-600">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-muted-foreground">{description}</p>}
    </div>
  )
}
