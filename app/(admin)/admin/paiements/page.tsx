import { getStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { PaymentsTable } from "@/components/admin/payments-table"
import { formatEURPrecise } from "@/lib/format"

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

      <PaymentsTable donations={donations} />
    </div>
  )
}
