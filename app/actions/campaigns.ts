"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getStore, uid } from "@/lib/store"
import type { Campaign, CampaignCategory } from "@/lib/types"

const CATEGORY_IMAGE: Record<CampaignCategory, string> = {
  sante: "/campaigns/sante.png",
  education: "/campaigns/education.png",
  urgence: "/campaigns/urgence.png",
  environnement: "/campaigns/environnement.png",
  communaute: "/campaigns/communaute.png",
  creatif: "/campaigns/creatif.png",
}

const CATEGORY_VIDEO: Record<CampaignCategory, string> = {
  sante: "/campaigns/sante.mp4",
  education: "/campaigns/education.mp4",
  urgence: "/campaigns/urgence.mp4",
  environnement: "/campaigns/environnement.mp4",
  communaute: "/campaigns/communaute.mp4",
  creatif: "/campaigns/creatif.mp4",
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
}

export type CampaignState = { error?: string } | undefined

export async function createCampaignAction(_prev: CampaignState, formData: FormData): Promise<CampaignState> {
  const user = await getCurrentUser()
  if (!user) redirect("/connexion")

  const title = String(formData.get("title") || "").trim()
  const summary = String(formData.get("summary") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const category = String(formData.get("category") || "communaute") as CampaignCategory
  const goalEuros = Number(formData.get("goal") || 0)
  const durationDays = Number(formData.get("duration") || 30)

  if (title.length < 5) return { error: "Le titre doit contenir au moins 5 caractères." }
  if (summary.length < 10) return { error: "Le résumé doit contenir au moins 10 caractères." }
  if (description.length < 30) return { error: "La description doit contenir au moins 30 caractères." }
  if (!goalEuros || goalEuros < 100) return { error: "L'objectif doit être d'au moins 100 €." }

  const store = getStore()
  const id = uid("c")
  const now = Date.now()
  const campaign: Campaign = {
    id,
    slug: `${slugify(title)}-${id.slice(-4)}`,
    title,
    summary,
    description,
    category,
    imageUrl: CATEGORY_IMAGE[category] ?? CATEGORY_IMAGE.communaute,
    videoUrl: CATEGORY_VIDEO[category] ?? CATEGORY_VIDEO.communaute,
    goal: Math.round(goalEuros * 100),
    raised: 0,
    ownerId: user.id,
    ownerName: user.name,
    status: "pending",
    boosted: false,
    rewards: [],
    createdAt: new Date(now).toISOString(),
    deadline: new Date(now + durationDays * 86_400_000).toISOString(),
  }
  store.campaigns.unshift(campaign)
  revalidatePath("/campagnes")
  redirect(`/campagnes/${campaign.slug}`)
}

export async function boostCampaignAction(campaignId: string): Promise<{ error?: string; ok?: boolean }> {
  const user = await getCurrentUser()
  if (!user) return { error: "Connectez-vous pour booster une campagne." }
  const store = getStore()
  const campaign = store.campaigns.find((c) => c.id === campaignId)
  if (!campaign) return { error: "Campagne introuvable." }
  if (campaign.ownerId !== user.id && user.role !== "admin") {
    return { error: "Seul le porteur peut booster cette campagne." }
  }
  const BOOST_COST = 2000 // 20 €
  const target = store.users.find((u) => u.id === user.id)!
  if (target.balance < BOOST_COST) {
    return { error: "Solde insuffisant. Rechargez votre portefeuille (20 € requis)." }
  }
  target.balance -= BOOST_COST
  campaign.boosted = true
  campaign.boostUntil = new Date(Date.now() + 7 * 86_400_000).toISOString()
  store.wallet.unshift({
    id: uid("w"),
    userId: user.id,
    type: "boost",
    amount: -BOOST_COST,
    label: `Boost campagne — ${campaign.title}`,
    createdAt: new Date().toISOString(),
  })
  revalidatePath(`/campagnes/${campaign.slug}`)
  revalidatePath("/wallet")
  return { ok: true }
}
