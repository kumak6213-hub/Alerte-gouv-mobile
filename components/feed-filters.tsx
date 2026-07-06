"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { value: "toutes", label: "Pour vous" },
  { value: "urgence", label: "Urgence" },
  { value: "sante", label: "Santé" },
  { value: "education", label: "Éducation" },
  { value: "environnement", label: "Environnement" },
  { value: "communaute", label: "Communauté" },
  { value: "creatif", label: "Créatif" },
]

export function FeedFilters({ active }: { active: string }) {
  const router = useRouter()
  const params = useSearchParams()

  function setCategory(value: string) {
    const next = new URLSearchParams(params.toString())
    if (value && value !== "toutes") next.set("categorie", value)
    else next.delete("categorie")
    router.push(`/campagnes?${next.toString()}`)
  }

  return (
    <div className="flex items-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((c) => {
        const isActive = active === c.value
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={cn(
              "relative shrink-0 py-1 text-sm font-semibold transition-colors",
              isActive ? "text-white" : "text-white/60 hover:text-white/90",
            )}
          >
            {c.label}
            {isActive && (
              <span className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-white" aria-hidden />
            )}
          </button>
        )
      })}
    </div>
  )
}
