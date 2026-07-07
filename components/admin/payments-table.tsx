"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { refundDonationAction } from "@/app/actions/admin"
import { formatDate, formatEURPrecise } from "@/lib/format"
import type { Donation, DonationStatus } from "@/lib/types"

const STATUS_VARIANT: Record<DonationStatus, "default" | "secondary" | "outline"> = {
  succeeded: "default",
  pending: "secondary",
  refunded: "outline",
}

const STATUS_LABEL: Record<DonationStatus, string> = {
  succeeded: "Réussi",
  pending: "En attente",
  refunded: "Remboursé",
}

function DonationRow({ donation }: { donation: Donation }) {
  const [pending, startTransition] = useTransition()

  function refund() {
    startTransition(async () => {
      await refundDonationAction(donation.id)
      toast.success(`Don de ${formatEURPrecise(donation.amount)} remboursé.`)
    })
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{donation.donorName}</span>
          {donation.anonymous && <Badge variant="outline" className="text-xs">Anonyme</Badge>}
          {donation.recurring && <Badge variant="secondary" className="text-xs">Récurrent</Badge>}
          <Badge variant={STATUS_VARIANT[donation.status]}>{STATUS_LABEL[donation.status]}</Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{donation.campaignTitle}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(donation.createdAt)}</p>
        {donation.message && (
          <p className="mt-1 text-xs italic text-muted-foreground">&ldquo;{donation.message}&rdquo;</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-base font-bold text-primary">{formatEURPrecise(donation.amount)}</span>
        {donation.status === "succeeded" && (
          <Button size="sm" variant="outline" disabled={pending} onClick={refund} className="h-7 gap-1 text-xs text-destructive hover:text-destructive">
            <RotateCcw className="size-3" /> Rembourser
          </Button>
        )}
      </div>
    </div>
  )
}

export function PaymentsTable({ donations }: { donations: Donation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Toutes les transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {donations.map((d) => (
          <DonationRow key={d.id} donation={d} />
        ))}
      </CardContent>
    </Card>
  )
}
