import Link from "next/link"
import { Mail, MapPin, Phone, Smartphone } from "lucide-react"

import { contact } from "@/lib/site-config"
import { Logo } from "@/components/site/logo"

const columns = [
  {
    title: "Learn & teach",
    links: [
      { label: "Explore courses", href: "/explore" },
      { label: "Technology", href: "/explore?category=technology" },
      { label: "Health & Medicine", href: "/explore?category=health-medicine" },
      { label: "Accounting & Finance", href: "/explore?category=accounting-finance" },
      { label: "Become an instructor", href: "/teach" },
      { label: "Create a course", href: "/instructor/courses/new" },
    ],
  },
  {
    title: "For schools & families",
    links: [
      { label: "Our product", href: "/product" },
      { label: "Online tuition", href: "/online-tuition" },
      { label: "KPSEA revision", href: "/kpsea-revision" },
      { label: "Child report", href: "/child-report" },
      { label: "School of Languages", href: "/languages" },
      { label: "For schools", href: "/schools" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Meet our team", href: "/about#team" },
      { label: "Blog", href: "/blog" },
      { label: "Pricing", href: "/pricing" },
      { label: "Customer care", href: "/support" },
      { label: "FAQs", href: "/faq" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            MlimaLMS is a learning marketplace where experts in every field
            teach what they know, plus live CBC classes, revision and progress
            reports for learners, parents and schools.
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-green-600" />
              {contact.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-green-600" />
              {contact.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-green-600" />
              {contact.email}
            </li>
          </ul>
          <Link
            href="/downloads"
            className="mt-6 inline-flex items-center gap-3 rounded-xl border bg-card px-4 py-2.5 transition-colors hover:border-green-600/40"
          >
            <Smartphone className="size-5 text-green-600" />
            <span className="text-sm">
              <span className="block text-xs text-muted-foreground">Android app</span>
              <span className="font-medium">Coming soon on Google Play</span>
            </span>
          </Link>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold">{column.title}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-green-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>© 2026 MlimaLMS. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-green-600">Privacy policy</Link>
            <Link href="/terms" className="hover:text-green-600">Terms of use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
