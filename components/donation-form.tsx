"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { donateAction, type DonationResult } from "@/app/actions/donations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const PRESETS = [10, 25, 50, 100]

export function DonationForm({
  campaignId,
  disabled,
  onSuccess,
}: {
  campaignId: string
  disabled?: boolean
  onSuccess?: () => void
}) {
  const router = useRouter()
  const [amount, setAmount] = useState<number>(25)
  const [state, formAction, pending] = useActionState<DonationResult, FormData>(donateAction, {})

  useEffect(() => {
    if (state?.ok) {
      toast.success("Merci pour votre don ! Votre contribution a bien été enregistrée.")
      router.refresh()
      onSuccess?.()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router, onSuccess])

  if (disabled) {
    return (
      <p className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
        Cette campagne n'accepte pas de dons pour le moment.
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="campaignId" value={campaignId} />
      <input type="hidden" name="amount" value={amount} />

      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p}
            type="button"
            variant={amount === p ? "default" : "outline"}
            onClick={() => setAmount(p)}
            className={cn("h-11")}
          >
            {p} €
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="custom-amount">Autre montant (€)</Label>
        <Input
          id="custom-amount"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message (optionnel)</Label>
        <Textarea id="message" name="message" rows={2} placeholder="Un mot d'encouragement..." />
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="recurring" className="size-4 accent-[var(--primary)]" />
          Faire de ce don un don mensuel
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="anonymous" className="size-4 accent-[var(--primary)]" />
          Faire un don anonyme
        </label>
      </div>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Heart data-icon="inline-start" fill="currentColor" />
        )}
        {pending ? "Traitement..." : `Donner ${amount} €`}
      </Button>
      <p className="text-center text-xs text-muted-foreground">Paiement simulé — aucune carte réelle requise.</p>
    </form>
  )
}
