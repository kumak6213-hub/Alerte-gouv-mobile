import { Suspense } from "react"
import { SearchX } from "lucide-react"
import { CampaignFeed } from "@/components/campaign-feed"
import { FeedFilters } from "@/components/feed-filters"
import { listCampaigns } from "@/lib/data"

export const metadata = {
  title: "Campagnes — Givok",
  description: "Découvrez et soutenez des campagnes solidaires sur Givok.",
}

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>
}) {
  const { categorie = "toutes", q = "" } = await searchParams
  const campaigns = listCampaigns({ category: categorie, q })

  return (
    <main className="relative">
      <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 to-transparent px-4 pb-8 pt-3">
        <Suspense fallback={null}>
          <FeedFilters active={categorie} />
        </Suspense>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-3 bg-black text-center text-white">
          <SearchX className="size-10 text-white/60" />
          <p className="font-medium">Aucune campagne trouvée</p>
          <p className="text-sm text-white/60">Essayez une autre catégorie ou un autre terme.</p>
        </div>
      ) : (
        <CampaignFeed campaigns={campaigns} />
      )}
    </main>
  )
}
