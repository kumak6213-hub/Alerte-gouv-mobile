"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Heart,
  MessageCircle,
  Share2,
  HeartHandshake,
  Gift,
  Music2,
  Clock,
  Zap,
  ChevronUp,
  Volume2,
  VolumeX,
  Play,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DonationForm } from "@/components/donation-form"
import { cn } from "@/lib/utils"
import { CATEGORY_LABELS, daysLeft, formatEUR, progress } from "@/lib/format"
import type { Campaign } from "@/lib/types"

function compact(n: number): string {
  return new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(n)
}

export function CampaignFeed({ campaigns }: { campaigns: Campaign[] }) {
  // Un seul état de son partagé pour toute la session de visionnage.
  const [muted, setMuted] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="h-[calc(100dvh-4rem)] snap-y snap-mandatory overflow-y-scroll overscroll-contain bg-black"
    >
      {campaigns.map((c, i) => (
        <FeedItem
          key={c.id}
          campaign={c}
          index={i}
          total={campaigns.length}
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
          rootRef={containerRef}
        />
      ))}
    </div>
  )
}

function FeedItem({
  campaign,
  index,
  total,
  muted,
  onToggleMute,
  rootRef,
}: {
  campaign: Campaign
  index: number
  total: number
  muted: boolean
  onToggleMute: () => void
  rootRef: React.RefObject<HTMLDivElement | null>
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(() => 200 + ((campaign.raised / 100) % 9000))
  const [paused, setPaused] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const canDonate = campaign.status === "active"
  // Valeur dépendante de l'heure : calculée après le montage pour éviter
  // toute divergence d'hydratation entre le serveur et le client.
  const [left, setLeft] = useState<number | null>(null)
  const pct = progress(campaign.raised, campaign.goal)

  useEffect(() => {
    setLeft(daysLeft(campaign.deadline))
  }, [campaign.deadline])

  // Lecture automatique de la vidéo lorsqu'elle est majoritairement visible.
  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.currentTime = 0
          video.play().then(() => setPaused(false)).catch(() => {})
        } else {
          video.pause()
        }
      },
      { root: rootRef.current, threshold: [0, 0.6, 1] },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [rootRef])

  // Applique l'état du son partagé à cette vidéo.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPaused(false)).catch(() => {})
    } else {
      video.pause()
      setPaused(true)
    }
  }

  function toggleLike() {
    setLiked((v) => {
      setLikes((n) => (v ? n - 1 : n + 1))
      return !v
    })
  }

  async function share() {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/campagnes/${campaign.slug}`
    // 1) Tente le partage natif ; 2) repli sur le presse-papier ; 3) repli visuel.
    if (navigator.share) {
      try {
        await navigator.share({ title: campaign.title, url })
        return
      } catch {
        /* partage natif indisponible ou annulé : on tente le presse-papier */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Lien copié dans le presse-papier")
    } catch {
      toast.info("Copiez ce lien pour partager", { description: url })
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[calc(100dvh-4rem)] w-full snap-start snap-always overflow-hidden bg-black"
    >
      {/* Vidéo de fond en plein écran */}
      <video
        ref={videoRef}
        src={campaign.videoUrl}
        poster={campaign.imageUrl || "/placeholder.svg"}
        className="absolute inset-0 size-full object-cover"
        playsInline
        loop
        muted={muted}
        preload={index === 0 ? "auto" : "metadata"}
        onClick={togglePlay}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      />

      {/* Indicateur de pause au centre (non interactif : le tap traverse jusqu'à la vidéo pour reprendre la lecture) */}
      {paused && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
            <Play className="size-9 translate-x-0.5" fill="currentColor" />
          </span>
        </div>
      )}

      {/* Dégradés de lisibilité */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

      {/* Métadonnées haut */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {CATEGORY_LABELS[campaign.category]}
        </span>
        <div className="flex items-center gap-2">
          {campaign.boosted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-boost px-3 py-1 text-xs font-semibold text-boost-foreground">
              <Zap className="size-3.5" fill="currentColor" />
              Boostée
            </span>
          )}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? "Activer le son" : "Couper le son"}
            className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* Barre d'actions à droite */}
      <div className="absolute bottom-28 right-3 z-30 flex flex-col items-center gap-5">
        <ActionButton
          label={compact(Math.round(likes))}
          onClick={toggleLike}
          active={liked}
          ariaLabel={liked ? "Retirer le J'aime" : "J'aime"}
          icon={<Heart className={cn("size-7", liked && "fill-current")} />}
        />
        <ActionButton
          label="Détails"
          onClick={() => setDetailsOpen(true)}
          ariaLabel="Voir les détails"
          icon={<MessageCircle className="size-7" />}
        />
        <ActionButton label="Partager" onClick={share} icon={<Share2 className="size-7" />} />
        <ActionButton
          label="Don"
          onClick={() => setDonateOpen(true)}
          ariaLabel="Faire un don"
          icon={<HeartHandshake className="size-7" />}
        />
      </div>

      {/* Contenu bas (le conteneur ne capture pas les taps ; seuls ses éléments interactifs le font) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 p-4 pr-20 pb-6 text-white">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {campaign.ownerName.charAt(0)}
          </span>
          <span>@{campaign.ownerName.toLowerCase().replace(/\s+/g, "")}</span>
        </div>

        <h2 className="text-balance text-lg font-bold leading-snug drop-shadow-sm">{campaign.title}</h2>
        <p className="line-clamp-2 text-pretty text-sm text-white/80">{campaign.summary}</p>

        <div className="flex items-center gap-2 text-xs text-white/70">
          <Music2 className="size-3.5" />
          <span className="line-clamp-1">Objectif {formatEUR(campaign.goal)}</span>
          <span aria-hidden>•</span>
          <Clock className="size-3.5" />
          <span>{left === null ? "\u2014" : left > 0 ? `${left} j restants` : "Terminée"}</span>
        </div>

        {/* Progression */}
        <div className="flex flex-col gap-1.5">
          <Progress value={pct} className="h-1.5 bg-white/25" />
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">{formatEUR(campaign.raised)} collectés</span>
            <span className="text-white/70">{pct}%</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setDonateOpen(true)}
          size="lg"
          className="pointer-events-auto mt-1 w-full rounded-full bg-white text-black hover:bg-white/90"
        >
          <HeartHandshake data-icon="inline-start" />
          Faire un don
        </Button>
      </div>

      {/* Panneau de détails — affiche la campagne complète sans quitter le fil */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[85dvh] max-w-md overflow-y-auto">
          <DialogHeader>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {CATEGORY_LABELS[campaign.category]}
            </span>
            <DialogTitle className="text-balance">{campaign.title}</DialogTitle>
            <DialogDescription>Organisé par {campaign.ownerName}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Progress value={pct} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{formatEUR(campaign.raised)} collectés</span>
                <span className="text-muted-foreground">
                  {pct}% · objectif {formatEUR(campaign.goal)}
                </span>
              </div>
            </div>

            <p className="whitespace-pre-line text-pretty text-sm leading-relaxed text-muted-foreground">
              {campaign.description}
            </p>

            {campaign.rewards.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Gift className="size-4 text-primary" />
                  Récompenses
                </h3>
                {campaign.rewards.map((r) => (
                  <div key={r.id} className="rounded-lg border p-3">
                    <div className="text-sm font-semibold text-primary">{formatEUR(r.amount)} et +</div>
                    <div className="text-sm font-medium">{r.title}</div>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              className="w-full rounded-full"
              disabled={!canDonate}
              onClick={() => {
                setDetailsOpen(false)
                setDonateOpen(true)
              }}
            >
              <HeartHandshake data-icon="inline-start" />
              Faire un don
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue de don — permet de donner directement depuis le fil */}
      <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-balance">{campaign.title}</DialogTitle>
            <DialogDescription>
              Objectif {formatEUR(campaign.goal)} · {formatEUR(campaign.raised)} collectés
            </DialogDescription>
          </DialogHeader>
          <DonationForm campaignId={campaign.id} disabled={!canDonate} onSuccess={() => setDonateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Indice de balayage sur la première carte */}
      {index === 0 && total > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex flex-col items-center text-white/70">
          <ChevronUp className="size-5 animate-bounce" />
          <span className="text-[11px]">Glissez vers le haut</span>
        </div>
      )}
    </section>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
  href,
  active,
  ariaLabel,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
  active?: boolean
  ariaLabel?: string
}) {
  const className = "flex flex-col items-center gap-1 outline-none"
  const inner = (
    <>
      <span
        className={cn(
          "flex size-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors",
          active ? "text-rose-500" : "text-white hover:bg-white/25",
        )}
      >
        {icon}
      </span>
      <span className="text-xs font-medium text-white drop-shadow-sm">{label}</span>
    </>
  )

  // Lien de navigation : toute la zone (icône + libellé) est cliquable.
  if (href) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel ?? label}>
        {inner}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-pressed={active}
      aria-label={ariaLabel ?? label}
    >
      {inner}
    </button>
  )
}
