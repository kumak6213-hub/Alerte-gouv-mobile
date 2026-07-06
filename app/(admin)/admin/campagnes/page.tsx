"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { CheckCircle, XCircle, PauseCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { setCampaignStatusAction } from "@/app/actions/admin"
import { listCampaigns } from "@/lib/data"
import { CATEGORY_LABELS, STATUS_LABELS, formatEUR, formatDate, progress } from "@/lib/format"
import type { Campaign, CampaignStatus } from "@/lib/types"

const STATUS_VARIANT: Record<CampaignStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  pending: "secondary",
  closed: "outline",
  suspended: "destructive",
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const [pending, startTransition] = useTransition()
  const pct = progress(campaign.raised, campaign.goal)

  function setStatus(status: CampaignStatus) {
    startTransition(async () => {
      await setCampaignStatusAction(campaign.id, status)
      toast.success(`Campagne marquée comme « ${STATUS_LABELS[status]} »`)
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[campaign.category]}</span>
            <Badge variant={STATUS_VARIANT[campaign.status]}>{STATUS_LABELS[campaign.status]}</Badge>
            {campaign.boosted && (
              <Badge className="border-0 bg-boost text-boost-foreground text-xs">Boostée</Badge>
            )}
          </div>
          <h3 className="mt-1 text-sm font-semibold leading-snug">{campaign.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {campaign.ownerName} · créée le {formatDate(campaign.createdAt)}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {campaign.status !== "active" && (
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => setStatus("active")}
              className="h-7 gap-1 text-xs"
            >
              <CheckCircle className="size-3" />
              Activer
            </Button>
          )}
          {campaign.status !== "pending" && (
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => setStatus("pending")}
              className="h-7 gap-1 text-xs"
            >
              <Clock className="size-3" />
              En attente
            </Button>
          )}
          {campaign.status !== "suspended" && (
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => setStatus("suspended")}
              className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
            >
              <PauseCircle className="size-3" />
              Suspendre
            </Button>
          )}
          {campaign.status !== "closed" && (
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => setStatus("closed")}
              className="h-7 gap-1 text-xs"
            >
              <XCircle className="size-3" />
              Clore
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Progress value={pct} className="h-1.5 flex-1" />
        <span className="text-xs font-medium text-muted-foreground">
          {formatEUR(campaign.raised)} / {formatEUR(campaign.goal)} ({pct}%)
        </span>
      </div>
    </div>
  )
}

export default function AdminCampaignsPage() {
  const campaigns = listCampaigns()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Campagnes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Modérez le statut de chaque campagne sur la plateforme.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {campaigns.length} campagne{campaigns.length > 1 ? "s" : ""} au total
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {campaigns.map((c) => (
            <CampaignRow key={c.id} campaign={c} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
