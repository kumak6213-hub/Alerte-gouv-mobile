"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const LINKS = [
  { href: "/campagnes", label: "Campagnes" },
  { href: "/creer", label: "Lancer un projet" },
  { href: "/#comment", label: "Comment ça marche" },
]

export function MobileNav({ isAuthed }: { isAuthed: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu" />}
      >
        <Menu />
      </DialogTrigger>
      <DialogContent className="top-20 max-w-sm translate-y-0">
        <DialogHeader>
          <DialogTitle>Menu</DialogTitle>
        </DialogHeader>
        <nav className="flex flex-col gap-1">
          {LINKS.map((l) => (
            <Button
              key={l.href}
              variant="ghost"
              className="justify-start"
              render={<Link href={l.href} />}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Button>
          ))}
          {!isAuthed && (
            <div className="mt-2 flex flex-col gap-2 border-t pt-3">
              <Button variant="outline" render={<Link href="/connexion" />} onClick={() => setOpen(false)}>
                Connexion
              </Button>
              <Button render={<Link href="/inscription" />} onClick={() => setOpen(false)}>
                Inscription
              </Button>
            </div>
          )}
        </nav>
      </DialogContent>
    </Dialog>
  )
}
