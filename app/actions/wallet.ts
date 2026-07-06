"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { charge } from "@/lib/payments"
import { getStore, uid } from "@/lib/store"

export type WalletResult = { error?: string; ok?: boolean }

export async function topupAction(_prev: WalletResult, formData: FormData): Promise<WalletResult> {
  const user = await getCurrentUser()
  if (!user) return { error: "Vous devez être connecté." }
  const amountEuros = Number(formData.get("amount") || 0)
  if (!amountEuros || amountEuros < 5) return { error: "Le rechargement minimum est de 5 €." }

  const amount = Math.round(amountEuros * 100)
  const payment = await charge(amount, { description: "Rechargement du portefeuille" })
  if (!payment.ok) return { error: payment.error ?? "Le paiement a échoué." }

  const store = getStore()
  const target = store.users.find((u) => u.id === user.id)!
  target.balance += amount
  store.wallet.unshift({
    id: uid("w"),
    userId: user.id,
    type: "topup",
    amount,
    label: "Rechargement du portefeuille",
    createdAt: new Date().toISOString(),
  })
  revalidatePath("/wallet")
  return { ok: true }
}

export async function withdrawAction(_prev: WalletResult, formData: FormData): Promise<WalletResult> {
  const user = await getCurrentUser()
  if (!user) return { error: "Vous devez être connecté." }
  const amountEuros = Number(formData.get("amount") || 0)
  if (!amountEuros || amountEuros < 10) return { error: "Le retrait minimum est de 10 €." }

  const amount = Math.round(amountEuros * 100)
  const store = getStore()
  const target = store.users.find((u) => u.id === user.id)!
  if (target.balance < amount) return { error: "Solde insuffisant." }

  target.balance -= amount
  store.wallet.unshift({
    id: uid("w"),
    userId: user.id,
    type: "withdrawal",
    amount: -amount,
    label: "Retrait vers compte bancaire",
    createdAt: new Date().toISOString(),
  })
  revalidatePath("/wallet")
  return { ok: true }
}
