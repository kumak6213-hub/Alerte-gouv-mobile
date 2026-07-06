"use client"

import Link from "next/link"
import { LayoutDashboard, LogOut, Settings, User as UserIcon, Wallet } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props {
  name: string
  email: string
  role: "user" | "admin"
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function UserMenu({ name, email, role }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 pl-1 pr-2" />}>
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">{name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate">{name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/profil" />}>
            <UserIcon data-icon="inline-start" />
            Mon profil
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/wallet" />}>
            <Wallet data-icon="inline-start" />
            Portefeuille
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/reglages" />}>
            <Settings data-icon="inline-start" />
            Réglages
          </DropdownMenuItem>
          {role === "admin" && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <LayoutDashboard data-icon="inline-start" />
              Administration
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="w-full"
          onClick={() => logoutAction()}
        >
          <LogOut data-icon="inline-start" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
