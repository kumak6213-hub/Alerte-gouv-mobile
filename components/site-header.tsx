import Link from "next/link"
import { Heart, Plus } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { MobileNav } from "@/components/mobile-nav"

const NAV = [
  { href: "/campagnes", label: "Campagnes" },
  { href: "/creer", label: "Lancer un projet" },
  { href: "/#comment", label: "Comment ça marche" },
]

export async function SiteHeader() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="size-4" fill="currentColor" />
            </span>
            <span className="text-lg tracking-tight">Givok</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" render={<Link href={item.href} />}>
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button render={<Link href="/creer" />} size="sm" className="hidden sm:inline-flex">
            <Plus data-icon="inline-start" />
            Créer
          </Button>
          {user ? (
            <UserMenu name={user.name} email={user.email} role={user.role} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" render={<Link href="/connexion" />}>
                Connexion
              </Button>
              <Button size="sm" render={<Link href="/inscription" />}>
                Inscription
              </Button>
            </div>
          )}
          <MobileNav isAuthed={!!user} />
        </div>
      </div>
    </header>
  )
}
