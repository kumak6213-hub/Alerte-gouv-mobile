"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Zap } from "lucide-react"
import { toast } from "sonner"
import { boostCampaignAction } from "@/app/actions/campaigns"
import { Button } from "@/components/ui/button"

export function BoostButton({ campaignId, boosted }: { campaignId: string; boosted: boolean }) {
  const [pending, start] = useTransition()
  const router = useRouter()

  function onClick() {
    start(async () => {
      const res = await boostCampaignAction(campaignId)
      if (res.ok) {
        toast.success("Campagne boostée pour 7 jours ! Elle apparaîtra en tête de liste.")
        router.refresh()
      } else {
        toast.error(res.error ?? "Une erreur est survenue.")
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={pending || boosted}
      className="border-boost/50 text-boost-foreground"
    >
      {pending ? (
        <Loader2 data-icon="inline-start" className="animate-spin" />
      ) : (
        <Zap data-icon="inline-start" fill="currentColor" />
      )}
      {boosted ? "Déjà boostée" : "Booster (20 €)"}
    </Button>
  )
}
