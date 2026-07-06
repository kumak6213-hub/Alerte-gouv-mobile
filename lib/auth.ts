import { cookies } from "next/headers"
import { getStore } from "./store"
import type { User } from "./types"

const SESSION_COOKIE = "givok_session"

// Auth simulée : on stocke seulement l'id utilisateur dans un cookie.
// À remplacer par Better Auth + Neon lors du branchement de la base.

export async function getCurrentUser(): Promise<User | null> {
  const store = getStore()
  const jar = await cookies()
  const id = jar.get(SESSION_COOKIE)?.value
  if (!id) return null
  return store.users.find((u) => u.id === id) ?? null
}

export async function setSession(userId: string): Promise<void> {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

/** Version publique de l'utilisateur, sans le mot de passe. */
export function publicUser(user: User): Omit<User, "password"> {
  const { password: _password, ...rest } = user
  return rest
}
