// Montants stockés en centimes d'euro.

export function formatEUR(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function formatEURPrecise(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

export function daysLeft(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

export function progress(raised: number, goal: number): number {
  if (goal <= 0) return 0
  return Math.min(100, Math.round((raised / goal) * 100))
}

export const CATEGORY_LABELS: Record<string, string> = {
  sante: "Santé",
  education: "Éducation",
  urgence: "Urgence",
  environnement: "Environnement",
  communaute: "Communauté",
  creatif: "Créatif",
}

export const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  pending: "En attente",
  closed: "Terminée",
  suspended: "Suspendue",
}
