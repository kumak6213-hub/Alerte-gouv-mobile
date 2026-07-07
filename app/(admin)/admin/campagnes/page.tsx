import { listCampaigns } from "@/lib/data"
import { CampaignsTable } from "@/components/admin/campaigns-table"

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
      <CampaignsTable campaigns={campaigns} />
    </div>
  )
}
