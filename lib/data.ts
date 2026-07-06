import { getStore } from "./store"
import type { Campaign } from "./types"

export function listCampaigns(opts?: { category?: string; q?: string }): Campaign[] {
  const store = getStore()
  let list = [...store.campaigns]
  if (opts?.category && opts.category !== "toutes") {
    list = list.filter((c) => c.category === opts.category)
  }
  if (opts?.q) {
    const q = opts.q.toLowerCase()
    list = list.filter(
      (c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q),
    )
  }
  // Boostées d'abord, puis récentes.
  return list.sort((a, b) => {
    if (a.boosted !== b.boosted) return a.boosted ? -1 : 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return getStore().campaigns.find((c) => c.slug === slug)
}

export function getCampaignDonations(campaignId: string) {
  return getStore()
    .donations.filter((d) => d.campaignId === campaignId && d.status === "succeeded")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getUserCampaigns(userId: string): Campaign[] {
  return getStore().campaigns.filter((c) => c.ownerId === userId)
}

export function getUserDonations(userId: string) {
  return getStore()
    .donations.filter((d) => d.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getWalletTx(userId: string) {
  return getStore()
    .wallet.filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getNotifications(userId: string) {
  return getStore()
    .notifications.filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getPlatformStats() {
  const store = getStore()
  const succeeded = store.donations.filter((d) => d.status === "succeeded")
  const totalRaised = succeeded.reduce((sum, d) => sum + d.amount, 0)
  return {
    users: store.users.length,
    campaigns: store.campaigns.length,
    activeCampaigns: store.campaigns.filter((c) => c.status === "active").length,
    donations: succeeded.length,
    totalRaised,
  }
}
