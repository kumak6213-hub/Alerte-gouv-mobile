"use server"

import { redirect } from "next/navigation"
import { clearSession, getCurrentUser, setSession } from "@/lib/auth"
import { getStore, uid } from "@/lib/store"

export type AuthState = { error?: string } | undefined

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")
  const store = getStore()
  const user = store.users.find((u) => u.email.toLowerCase() === email)
  if (!user || user.password !== password) {
    return { error: "E-mail ou mot de passe incorrect." }
  }
  await setSession(user.id)
  redirect(user.role === "admin" ? "/admin" : "/profil")
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")

  if (name.length < 2) return { error: "Veuillez saisir votre nom complet." }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Adresse e-mail invalide." }
  if (password.length < 6) return { error: "Le mot de passe doit contenir au moins 6 caractères." }

  const store = getStore()
  if (store.users.some((u) => u.email.toLowerCase() === email)) {
    return { error: "Un compte existe déjà avec cet e-mail." }
  }

  const id = uid("u")
  store.users.push({
    id,
    name,
    email,
    password,
    role: "user",
    balance: 0,
    createdAt: new Date().toISOString(),
  })
  await setSession(id)
  redirect("/profil")
}

export async function logoutAction(): Promise<void> {
  await clearSession()
  redirect("/")
}

export async function updateProfileAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const user = await getCurrentUser()
  if (!user) return { error: "Vous devez être connecté." }
  const store = getStore()
  const target = store.users.find((u) => u.id === user.id)
  if (!target) return { error: "Utilisateur introuvable." }

  const name = String(formData.get("name") || "").trim()
  const bio = String(formData.get("bio") || "").trim()
  if (name.length >= 2) target.name = name
  target.bio = bio
  return { error: undefined }
}
