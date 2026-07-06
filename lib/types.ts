export type UserRole = "user" | "admin"

export interface User {
  id: string
  name: string
  email: string
  password: string // mock only — never store plaintext in a real app
  role: UserRole
  avatarUrl?: string
  bio?: string
  balance: number // solde du portefeuille en centimes
  createdAt: string
}

export type CampaignStatus = "active" | "pending" | "closed" | "suspended"
export type CampaignCategory = "sante" | "education" | "urgence" | "environnement" | "communaute" | "creatif"

export interface RewardTier {
  id: string
  title: string
  description: string
  amount: number // palier minimum en centimes
}

export interface Campaign {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  category: CampaignCategory
  imageUrl: string // image d'aperçu (poster de la vidéo)
  videoUrl: string // vidéo verticale de la campagne (format court)
  goal: number // objectif en centimes
  raised: number // collecté en centimes
  ownerId: string
  ownerName: string
  status: CampaignStatus
  boosted: boolean
  boostUntil?: string
  rewards: RewardTier[]
  createdAt: string
  deadline: string
}

export type DonationStatus = "succeeded" | "pending" | "refunded"

export interface Donation {
  id: string
  campaignId: string
  campaignTitle: string
  userId: string | null
  donorName: string
  amount: number // centimes
  message?: string
  anonymous: boolean
  recurring: boolean
  status: DonationStatus
  createdAt: string
}

export type TxType = "donation_in" | "donation_out" | "withdrawal" | "boost" | "topup" | "reward"

export interface WalletTx {
  id: string
  userId: string
  type: TxType
  amount: number // centimes, signé (+/-)
  label: string
  createdAt: string
}

export interface AppNotification {
  id: string
  userId: string
  title: string
  body: string
  read: boolean
  createdAt: string
}
