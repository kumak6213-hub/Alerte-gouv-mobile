"use client"

import { Check, Link2, Share2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Lien copié dans le presse-papiers.")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Impossible de copier le lien.")
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href })
      } catch {
        /* annulé par l'utilisateur */
      }
    } else {
      copy()
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={share}>
        <Share2 data-icon="inline-start" />
        Partager
      </Button>
      <Button variant="outline" size="sm" onClick={copy}>
        {copied ? <Check data-icon="inline-start" /> : <Link2 data-icon="inline-start" />}
        {copied ? "Copié" : "Copier le lien"}
      </Button>
    </div>
  )
}
