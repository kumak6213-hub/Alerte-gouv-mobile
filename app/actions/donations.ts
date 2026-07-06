"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { charge } from "@/lib/payments"
import { getStore, uid } from "@/lib/store"

export type DonationResult = { error?: string; ok?: boolean; amount?: number }

export async function donateAction(_prev: DonationResult, formData: FormData): Promise<DonationResult> {
  const campaignId = String(formData.get("campaignId") || "")
  const amountEuros = Number(formData.get("amount") || 0)
  const message = String(formData.get("message") || "").trim()
  const anonymous = formData.get("anonymous") === "on"
  const recurring = formData.get("recurring") === "on"

  if (!amountEuros || amountEuros < 1) {
    return { error: "Le montant minimum est de 1 €." }
  }

  const store = getStore()
  const campaign = store.campaigns.find((c) => c.id === campaignId)
  if (!campaign) return { error: "Campagne introuvable." }
  if (campaign.status !== "active") return { error: "Cette campagne n'accepte pas de dons pour le moment." }

  const amount = Math.round(amountEuros * 100)
  const user = await getCurrentUser()

  // Paiement simulé (à remplacer par Stripe Checkout).
  const payment = await charge(amount, {
    description: `Don — ${campaign.title}`,
  })
  if (!payment.ok) {
    return { error: payment.error ?? "Le paiement a échoué." }
  }

  const donorName = anonymous ? "Anonyme" : user?.name ?? "Donateur"
  store.donations.unshift({
    id: uid("d"),
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    userId: anonymous ? null : user?.id ?? null,
    donorName,
    amount,
    message: message || undefined,
    anonymous,
    recurring,
    status: "succeeded",
    createdAt: new Date().toISOString(),
  })
  campaign.raised += amount

  // Crédite le portefeuille du porteur.
  const owner = store.users.find((u) => u.id === campaign.ownerId)
  if (owner) {
    owner.balance += amount
    store.wallet.unshift({
      id: uid("w"),
      userId: owner.id,
      type: "donation_in",
      amount,
      label: `Don reçu — ${campaign.title}`,
      createdAt: new Date().toISOString(),
    })
    store.notifications.unshift({
      id: uid("n"),
      userId: owner.id,
      title: "Nouveau don reçu",
      body: `${donorName} a soutenu « ${campaign.title} ».`,
      read: false,
      createdAt: new Date().toISOString(),
    })
  }

  revalidatePath(`/campagnes/${campaign.slug}`)
  revalidatePath("/campagnes")
  revalidatePath("/wallet")
  return { ok: true, amount }
}
