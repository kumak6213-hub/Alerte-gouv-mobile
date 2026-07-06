import { logoutAction } from "@/app/actions/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function AdminHeader({ user }: { user: User }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6">
      <p className="text-sm text-muted-foreground">
        Connecté en tant que <span className="font-medium text-foreground">{user.name}</span>
      </p>

      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <form action={logoutAction}>
          <Button variant="outline" size="sm" type="submit">
            Déconnexion
          </Button>
        </form>
      </div>
    </header>
  )
}
