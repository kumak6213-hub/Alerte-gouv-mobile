"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { ShieldCheck, ShieldOff } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { setUserRoleAction } from "@/app/actions/admin"
import { getStore } from "@/lib/store"
import { formatDate, formatEUR } from "@/lib/format"
import type { User } from "@/lib/types"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function UserRow({ user }: { user: User }) {
  const [pending, startTransition] = useTransition()

  function toggleRole() {
    const next = user.role === "admin" ? "user" : "admin"
    startTransition(async () => {
      await setUserRoleAction(user.id, next)
      toast.success(
        next === "admin"
          ? `${user.name} est maintenant administrateur.`
          : `${user.name} est maintenant utilisateur standard.`,
      )
    })
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-sm">
          {initials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{user.name}</span>
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
            {user.role === "admin" ? "Admin" : "Utilisateur"}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Inscrit le {formatDate(user.createdAt)} · Solde {formatEUR(user.balance)}
        </p>
      </div>

      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={toggleRole}
        className="shrink-0 gap-1.5"
      >
        {user.role === "admin" ? (
          <>
            <ShieldOff className="size-3.5" />
            Révoquer admin
          </>
        ) : (
          <>
            <ShieldCheck className="size-3.5" />
            Promouvoir admin
          </>
        )}
      </Button>
    </div>
  )
}

export default function AdminUsersPage() {
  const users = getStore().users

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez les rôles et les comptes des membres de la plateforme.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {users.length} compte{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
