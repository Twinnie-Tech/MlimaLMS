import Link from "next/link";
import { ArrowLeft, MountainSnow } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <span className="flex size-14 animate-float items-center justify-center rounded-2xl bg-green-600 text-white">
        <MountainSnow className="size-8" />
      </span>
      <div>
        <p className="text-sm font-medium text-green-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          We could not find the page you are looking for.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants(), "bg-green-600 text-white hover:bg-green-700")}>
          <ArrowLeft />
          Back to home
        </Link>
        <Link href="/support" className={buttonVariants({ variant: "outline" })}>
          Contact support
        </Link>
      </div>
    </div>
  );
}
