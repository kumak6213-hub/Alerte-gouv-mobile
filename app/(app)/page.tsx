import { CampaignFeed } from "@/components/campaign-feed"
import { listCampaigns } from "@/lib/data"

export default function HomePage() {
  const active = listCampaigns().filter((c) => c.status === "active")

  return (
    <main>
      <CampaignFeed campaigns={active} />
    </main>
  )
}
