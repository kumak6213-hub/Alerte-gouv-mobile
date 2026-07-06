"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { refundDonationAction } from "@/app/actions/admin"
import { getStore } from "@/lib/store"
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
          {donation.anonymous && (
            <Badge variant="outline" className="text-xs">Anonyme</Badge>
          )}
          {donation.recurring && (
            <Badge variant="secondary" className="text-xs">Récurrent</Badge>
          )}
          <Badge variant={STATUS_VARIANT[donation.status]}>
            {STATUS_LABEL[donation.status]}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{donation.campaignTitle}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(donation.createdAt)}</p>
        {donation.message && (
          <p className="mt-1 text-xs italic text-muted-foreground">&ldquo;{donation.message}&rdquo;</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-base font-bold text-primary">
          {formatEURPrecise(donation.amount)}
        </span>
        {donation.status === "succeeded" && (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={refund}
            className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
          >
            <RotateCcw className="size-3" />
            Rembourser
          </Button>
        )}
      </div>
    </div>
  )
}

export default function AdminPaymentsPage() {
  const donations = [...getStore().donations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const total = donations
    .filter((d) => d.status === "succeeded")
    .reduce((sum, d) => sum + d.amount, 0)

  const refunded = donations
    .filter((d) => d.status === "refunded")
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paiements</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultez tous les dons et effectuez des remboursements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total collecté</p>
            <p className="mt-1 text-xl font-bold text-primary">{formatEURPrecise(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Remboursé</p>
            <p className="mt-1 text-xl font-bold text-destructive">{formatEURPrecise(refunded)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="mt-1 text-xl font-bold">{donations.length}</p>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}
