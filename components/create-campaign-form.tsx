"use client"

import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createCampaignAction, type CampaignState } from "@/app/actions/campaigns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CreateCampaignForm() {
  const [state, formAction, pending] = useActionState<CampaignState, FormData>(createCampaignAction, {})

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Titre du projet</Label>
        <Input id="title" name="title" placeholder="Ex : Une école numérique pour Teranga" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Résumé court</Label>
        <Input id="summary" name="summary" placeholder="Une phrase pour convaincre en un coup d'œil" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Catégorie</Label>
          <Select name="category" defaultValue="communaute">
            <SelectTrigger id="category">
              <SelectValue placeholder="Choisir" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sante">Santé</SelectItem>
                <SelectItem value="education">Éducation</SelectItem>
                <SelectItem value="urgence">Urgence</SelectItem>
                <SelectItem value="environnement">Environnement</SelectItem>
                <SelectItem value="communaute">Communauté</SelectItem>
                <SelectItem value="creatif">Créatif</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="duration">Durée (jours)</Label>
          <Input id="duration" name="duration" type="number" min={7} max={180} defaultValue={30} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="goal">Objectif de collecte (€)</Label>
        <Input id="goal" name="goal" type="number" min={100} step={100} placeholder="10000" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          name="description"
          rows={7}
          placeholder="Racontez votre histoire, expliquez l'utilisation des fonds et l'impact attendu..."
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {pending ? "Création..." : "Publier la campagne"}
        </Button>
        <p className="text-sm text-muted-foreground">Votre campagne sera examinée avant sa mise en ligne.</p>
      </div>
    </form>
  )
}
