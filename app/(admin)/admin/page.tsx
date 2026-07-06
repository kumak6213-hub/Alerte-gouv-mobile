import { Users, Megaphone, HeartHandshake, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPlatformStats, listCampaigns } from "@/lib/data"
import { getStore } from "@/lib/store"
import { formatEUR, formatEURPrecise, formatDate, STATUS_LABELS, CATEGORY_LABELS } from "@/lib/format"

function StatCard({
  title,
  value,
  icon: Icon,
  sub,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  sub?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  pending: "secondary",
  closed: "outline",
  suspended: "destructive",
}

export default function AdminDashboardPage() {
  const stats = getPlatformStats()
  const campaigns = listCampaigns()
  const store = getStore()
  const recentDonations = [...store.donations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vue d&apos;ensemble de la plateforme Givok.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Utilisateurs"
          value={String(stats.users)}
          icon={Users}
          sub="comptes enregistrés"
        />
        <StatCard
          title="Campagnes actives"
          value={String(stats.activeCampaigns)}
          icon={Megaphone}
          sub={`${stats.campaigns} au total`}
        />
        <StatCard
          title="Dons validés"
          value={String(stats.donations)}
          icon={HeartHandshake}
          sub="transactions réussies"
        />
        <StatCard
          title="Total collecté"
          value={formatEUR(stats.totalRaised)}
          icon={TrendingUp}
          sub="sur l'ensemble des campagnes"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campagnes récentes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {campaigns.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[c.category]} · {c.ownerName}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[c.status] ?? "outline"}>
                  {STATUS_LABELS[c.status]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent donations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dons récents</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recentDonations.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.donorName}</p>
                  <p className="truncate text-xs text-muted-foreground">{d.campaignTitle}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-sm font-semibold text-primary">
                    {formatEURPrecise(d.amount)}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(d.createdAt)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
