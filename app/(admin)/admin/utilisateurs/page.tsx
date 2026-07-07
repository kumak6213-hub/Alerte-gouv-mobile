import { getStore } from "@/lib/store"
import { UsersTable } from "@/components/admin/users-table"

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
      <UsersTable users={users} />
    </div>
  )
}
