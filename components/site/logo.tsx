import Link from "next/link"
import { MountainSnow } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-green-600 text-white">
        <MountainSnow className="size-5" />
      </span>
      MlimaLMS
    </Link>
  )
}
