"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { value: "toutes", label: "Toutes" },
  { value: "sante", label: "Santé" },
  { value: "education", label: "Éducation" },
  { value: "urgence", label: "Urgence" },
  { value: "environnement", label: "Environnement" },
  { value: "communaute", label: "Communauté" },
  { value: "creatif", label: "Créatif" },
]

export function CampaignFilters({ active, q }: { active: string; q: string }) {
  const router = useRouter()
  const params = useSearchParams()

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value && value !== "toutes") next.set(key, value)
    else next.delete(key)
    router.push(`/campagnes?${next.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const input = e.currentTarget.elements.namedItem("q") as HTMLInputElement
          setParam("q", input.value.trim())
        }}
        className="relative max-w-md"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={q} placeholder="Rechercher une campagne..." className="pl-9" />
      </form>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button
            key={c.value}
            type="button"
            size="sm"
            variant={active === c.value ? "default" : "outline"}
            className={cn("rounded-full")}
            onClick={() => setParam("categorie", c.value)}
          >
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
