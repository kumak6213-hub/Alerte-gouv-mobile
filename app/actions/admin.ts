"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { getStore } from "@/lib/store"
import type { CampaignStatus } from "@/lib/types"

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") throw new Error("Accès refusé")
  return user
}

export async function setCampaignStatusAction(campaignId: string, status: CampaignStatus): Promise<void> {
  await requireAdmin()
  const store = getStore()
  const campaign = store.campaigns.find((c) => c.id === campaignId)
  if (campaign) campaign.status = status
  revalidatePath("/admin/campagnes")
  revalidatePath("/campagnes")
}

export async function setUserRoleAction(userId: string, role: "user" | "admin"): Promise<void> {
  await requireAdmin()
  const store = getStore()
  const user = store.users.find((u) => u.id === userId)
  if (user) user.role = role
  revalidatePath("/admin/utilisateurs")
}

export async function refundDonationAction(donationId: string): Promise<void> {
  await requireAdmin()
  const store = getStore()
  const donation = store.donations.find((d) => d.id === donationId)
  if (donation && donation.status === "succeeded") {
    donation.status = "refunded"
    const campaign = store.campaigns.find((c) => c.id === donation.campaignId)
    if (campaign) campaign.raised = Math.max(0, campaign.raised - donation.amount)
  }
  revalidatePath("/admin/paiements")
}
