import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Gift, Target, Users } from "lucide-react"
import { BoostButton } from "@/components/boost-button"
import { DonationForm } from "@/components/donation-form"
import { ShareButtons } from "@/components/share-buttons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser } from "@/lib/auth"
import { getCampaignBySlug, getCampaignDonations } from "@/lib/data"
import { CATEGORY_LABELS, STATUS_LABELS, daysLeft, formatDate, formatEUR, formatEURPrecise, progress } from "@/lib/format"

export default async function CampaignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const campaign = getCampaignBySlug(slug)
  if (!campaign) notFound()

  const donations = getCampaignDonations(campaign.id)
  const user = await getCurrentUser()
  const pct = progress(campaign.raised, campaign.goal)
  const left = daysLeft(campaign.deadline)
  const isOwner = user?.id === campaign.ownerId || user?.role === "admin"

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/campagnes" className="text-sm text-muted-foreground hover:text-foreground">
        ← Retour aux campagnes
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Colonne principale */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-muted">
            <Image
              src={campaign.imageUrl || "/placeholder.svg"}
              alt={campaign.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{CATEGORY_LABELS[campaign.category]}</Badge>
            {campaign.boosted && (
              <Badge className="border-0 bg-boost text-boost-foreground">Boostée</Badge>
            )}
            {campaign.status !== "active" && (
              <Badge variant="outline">{STATUS_LABELS[campaign.status]}</Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-balance">{campaign.title}</h1>

          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {campaign.ownerName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="text-muted-foreground">Organisé par </span>
              <span className="font-medium">{campaign.ownerName}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <ShareButtons title={campaign.title} />
            {isOwner && <BoostButton campaignId={campaign.id} boosted={campaign.boosted} />}
          </div>

          <Separator />

          <div className="prose prose-sm max-w-none">
            <h2 className="text-xl font-semibold">À propos de ce projet</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground text-pretty">
              {campaign.description}
            </p>
          </div>

          {campaign.rewards.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Gift className="size-5 text-primary" />
                Récompenses
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {campaign.rewards.map((r) => (
                  <Card key={r.id}>
                    <CardHeader>
                      <div className="text-sm font-semibold text-primary">{formatEUR(r.amount)} et +</div>
                      <CardTitle className="text-base">{r.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Users className="size-5 text-primary" />
              Donateurs récents
            </h2>
            {donations.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Soyez le premier à soutenir cette campagne !
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {donations.slice(0, 8).map((d) => (
                  <li key={d.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-secondary text-xs">
                        {d.donorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{d.donorName}</span>
                        <span className="text-sm font-semibold text-primary">{formatEURPrecise(d.amount)}</span>
                      </div>
                      {d.message && <p className="mt-0.5 text-sm text-muted-foreground">{d.message}</p>}
                      <span className="text-xs text-muted-foreground">{formatDate(d.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Colonne latérale sticky */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="flex flex-col gap-5">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{formatEUR(campaign.raised)}</span>
                  <span className="text-sm text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={pct} className="mt-2" />
                <p className="mt-2 text-sm text-muted-foreground">
                  sur un objectif de {formatEUR(campaign.goal)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <Clock className="size-4 text-primary" />
                  <div>
                    <div className="font-semibold">{left}</div>
                    <div className="text-xs text-muted-foreground">jours restants</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <Target className="size-4 text-primary" />
                  <div>
                    <div className="font-semibold">{donations.length}</div>
                    <div className="text-xs text-muted-foreground">contributions</div>
                  </div>
                </div>
              </div>

              <Separator />

              <DonationForm campaignId={campaign.id} disabled={campaign.status !== "active"} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
