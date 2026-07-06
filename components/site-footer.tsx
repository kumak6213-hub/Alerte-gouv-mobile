import Link from "next/link"
import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Heart className="size-3.5" fill="currentColor" />
              </span>
              Givok
            </div>
            <p className="mt-3 text-sm text-muted-foreground text-pretty">
              La plateforme de dons solidaires qui relie les porteurs de projets et les donateurs, en toute
              transparence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol
              title="Explorer"
              links={[
                { href: "/campagnes", label: "Campagnes" },
                { href: "/creer", label: "Lancer un projet" },
              ]}
            />
            <FooterCol
              title="Compte"
              links={[
                { href: "/connexion", label: "Connexion" },
                { href: "/inscription", label: "Inscription" },
                { href: "/wallet", label: "Portefeuille" },
              ]}
            />
            <FooterCol
              title="Plateforme"
              links={[
                { href: "/#comment", label: "Comment ça marche" },
                { href: "/reglages", label: "Réglages" },
              ]}
            />
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Givok. Démo — les paiements et données sont simulés.
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
