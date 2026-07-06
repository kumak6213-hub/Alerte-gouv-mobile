import Image from "next/image"
import Link from "next/link"
import { Clock, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CATEGORY_LABELS, daysLeft, formatEUR, progress } from "@/lib/format"
import type { Campaign } from "@/lib/types"

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pct = progress(campaign.raised, campaign.goal)
  const left = daysLeft(campaign.deadline)

  return (
    <Card className="group overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <Link href={`/campagnes/${campaign.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={campaign.imageUrl || "/placeholder.svg"}
            alt={campaign.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/90">
              {CATEGORY_LABELS[campaign.category]}
            </Badge>
            {campaign.boosted && (
              <Badge className="border-0 bg-boost text-boost-foreground">
                <Zap data-icon="inline-start" fill="currentColor" />
                Boostée
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <CardContent className="flex flex-col gap-2">
        <Link href={`/campagnes/${campaign.slug}`}>
          <h3 className="line-clamp-2 font-semibold leading-snug text-pretty group-hover:text-primary">
            {campaign.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{campaign.summary}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3">
        <Progress value={pct} />
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground">{formatEUR(campaign.raised)}</span>
          <span className="text-muted-foreground">{pct}%</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Objectif {formatEUR(campaign.goal)}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {left > 0 ? `${left} j restants` : "Terminée"}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
