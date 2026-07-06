// --------------------------------------------------------------------------
// Couche de paiement simulée. À remplacer par Stripe Checkout / PaymentIntents
// une fois l'intégration Stripe connectée. La signature reste volontairement
// proche d'un appel Stripe pour faciliter la migration.
// --------------------------------------------------------------------------

export interface ChargeResult {
  ok: boolean
  id?: string
  error?: string
}

export async function charge(
  amountCents: number,
  _opts?: { description?: string },
): Promise<ChargeResult> {
  // Simule une petite latence réseau.
  await new Promise((r) => setTimeout(r, 400))

  if (amountCents <= 0) {
    return { ok: false, error: "Montant invalide." }
  }
  // Toujours accepté en mode démo.
  return { ok: true, id: `pi_mock_${Math.random().toString(36).slice(2, 12)}` }
}
