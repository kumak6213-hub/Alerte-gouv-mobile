"use client"

import { useActionState } from "react"
import Link from "next/link"
import { LogIn } from "lucide-react"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConnexionPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined)

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="size-5 text-primary" />
          </div>
          <CardTitle className="text-xl">Connexion</CardTitle>
          <CardDescription>Connectez-vous à votre compte Givok.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {state?.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Connexion…" : "Se connecter"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-medium text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </p>

          {/* Dev hint */}
          <p className="mt-6 rounded-md bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
            Admin&nbsp;: <span className="font-mono">admin@givok.app</span> / <span className="font-mono">admin123</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
