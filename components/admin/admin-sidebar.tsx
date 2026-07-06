"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Megaphone, Users, CreditCard, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/campagnes", label: "Campagnes", icon: Megaphone, exact: false },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, exact: false },
  { href: "/admin/paiements", label: "Paiements", icon: CreditCard, exact: false },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-card md:flex">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <span className="text-lg font-bold tracking-tight text-primary">Givok</span>
        <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to app */}
      <div className="border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4 shrink-0" />
          Retour à l&apos;app
        </Link>
      </div>
    </aside>
  )
}
