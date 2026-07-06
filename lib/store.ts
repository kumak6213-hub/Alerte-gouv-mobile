import type { AppNotification, Campaign, Donation, User, WalletTx } from "./types"

// --------------------------------------------------------------------------
// Store en mémoire (mock). Les données sont réinitialisées au redémarrage du
// serveur. Cette couche est volontairement isolée pour être remplacée plus
// tard par Neon/Postgres sans toucher à l'interface.
// --------------------------------------------------------------------------

interface Store {
  users: User[]
  campaigns: Campaign[]
  donations: Donation[]
  wallet: WalletTx[]
  notifications: AppNotification[]
}

const g = globalThis as unknown as { __givokStore?: Store }

function seed(): Store {
  const now = Date.now()
  const day = 86_400_000

  const users: User[] = [
    {
      id: "u_admin",
      name: "Amina Diallo",
      email: "admin@givok.app",
      password: "admin123",
      role: "admin",
      avatarUrl: "",
      bio: "Responsable de la plateforme Givok.",
      balance: 0,
      createdAt: new Date(now - day * 120).toISOString(),
    },
    {
      id: "u_marie",
      name: "Marie Laurent",
      email: "marie@givok.app",
      password: "marie123",
      role: "user",
      bio: "Bénévole passionnée par l'éducation.",
      balance: 4500,
      createdAt: new Date(now - day * 60).toISOString(),
    },
    {
      id: "u_karim",
      name: "Karim Benali",
      email: "karim@givok.app",
      password: "karim123",
      role: "user",
      bio: "Porteur de projets communautaires.",
      balance: 128000,
      createdAt: new Date(now - day * 45).toISOString(),
    },
  ]

  const campaigns: Campaign[] = [
    {
      id: "c_sante",
      slug: "soins-pediatriques-clinique-espoir",
      title: "Soins pédiatriques pour la clinique Espoir",
      summary: "Financer du matériel médical vital pour soigner 500 enfants cette année.",
      description:
        "La clinique Espoir accueille chaque semaine des dizaines d'enfants qui n'ont pas accès à des soins de base. Grâce à vos dons, nous pourrons acheter des respirateurs pédiatriques, du matériel de diagnostic et former le personnel soignant. Chaque contribution compte et sera utilisée en toute transparence.",
      category: "sante",
      imageUrl: "/campaigns/sante.png",
      videoUrl: "/campaigns/sante.mp4",
      goal: 5_000_000,
      raised: 3_240_000,
      ownerId: "u_karim",
      ownerName: "Karim Benali",
      status: "active",
      boosted: true,
      boostUntil: new Date(now + day * 10).toISOString(),
      rewards: [
        { id: "r1", title: "Merci sincère", description: "Un message de remerciement personnalisé.", amount: 1000 },
        { id: "r2", title: "Nom sur le mur", description: "Votre nom sur le mur des donateurs de la clinique.", amount: 5000 },
        { id: "r3", title: "Visite guidée", description: "Une visite privée de la clinique rénovée.", amount: 25000 },
      ],
      createdAt: new Date(now - day * 30).toISOString(),
      deadline: new Date(now + day * 40).toISOString(),
    },
    {
      id: "c_education",
      slug: "ecole-numerique-village-teranga",
      title: "Une école numérique pour le village de Teranga",
      summary: "Équiper une salle informatique et offrir un accès au savoir à 300 élèves.",
      description:
        "Le village de Teranga n'a jamais eu accès à des ordinateurs. Ce projet vise à créer une salle informatique complète avec 20 postes, une connexion internet et un programme de formation pour les enseignants. Ensemble, ouvrons les portes du numérique à toute une génération.",
      category: "education",
      imageUrl: "/campaigns/education.png",
      videoUrl: "/campaigns/education.mp4",
      goal: 2_500_000,
      raised: 1_890_000,
      ownerId: "u_marie",
      ownerName: "Marie Laurent",
      status: "active",
      boosted: false,
      rewards: [
        { id: "r1", title: "Carte postale", description: "Une carte postale des élèves.", amount: 1500 },
        { id: "r2", title: "Parrain d'un poste", description: "Une plaque à votre nom sur un ordinateur.", amount: 10000 },
      ],
      createdAt: new Date(now - day * 20).toISOString(),
      deadline: new Date(now + day * 55).toISOString(),
    },
    {
      id: "c_urgence",
      slug: "aide-urgence-inondations",
      title: "Aide d'urgence aux victimes des inondations",
      summary: "Fournir eau potable, nourriture et abris aux familles sinistrées.",
      description:
        "Les récentes inondations ont laissé des centaines de familles sans abri. Nous organisons une distribution d'urgence de kits de survie : eau potable, nourriture, couvertures et tentes. La rapidité est essentielle — chaque jour compte pour ces familles.",
      category: "urgence",
      imageUrl: "/campaigns/urgence.png",
      videoUrl: "/campaigns/urgence.mp4",
      goal: 3_000_000,
      raised: 2_760_000,
      ownerId: "u_karim",
      ownerName: "Karim Benali",
      status: "active",
      boosted: true,
      boostUntil: new Date(now + day * 4).toISOString(),
      rewards: [],
      createdAt: new Date(now - day * 8).toISOString(),
      deadline: new Date(now + day * 12).toISOString(),
    },
    {
      id: "c_environnement",
      slug: "reforestation-collines-vertes",
      title: "Reforestation des Collines Vertes",
      summary: "Planter 10 000 arbres pour restaurer un écosystème menacé.",
      description:
        "La déforestation a fragilisé les Collines Vertes. Notre collectif souhaite planter 10 000 arbres d'espèces locales et former les habitants à l'entretien. Un projet durable pour le climat et la biodiversité.",
      category: "environnement",
      imageUrl: "/campaigns/environnement.png",
      videoUrl: "/campaigns/environnement.mp4",
      goal: 1_500_000,
      raised: 620_000,
      ownerId: "u_marie",
      ownerName: "Marie Laurent",
      status: "active",
      boosted: false,
      rewards: [
        { id: "r1", title: "Un arbre à votre nom", description: "Certificat numérique de plantation.", amount: 2000 },
      ],
      createdAt: new Date(now - day * 15).toISOString(),
      deadline: new Date(now + day * 70).toISOString(),
    },
    {
      id: "c_communaute",
      slug: "maison-de-quartier-solidaire",
      title: "Une maison de quartier solidaire",
      summary: "Créer un lieu de rencontre et d'entraide pour tout le quartier.",
      description:
        "Nous voulons transformer un local abandonné en maison de quartier : aide aux devoirs, ateliers, repas partagés et permanences sociales. Un espace pour recréer du lien.",
      category: "communaute",
      imageUrl: "/campaigns/communaute.png",
      videoUrl: "/campaigns/communaute.mp4",
      goal: 1_800_000,
      raised: 1_800_000,
      ownerId: "u_karim",
      ownerName: "Karim Benali",
      status: "closed",
      boosted: false,
      rewards: [],
      createdAt: new Date(now - day * 90).toISOString(),
      deadline: new Date(now - day * 5).toISOString(),
    },
    {
      id: "c_creatif",
      slug: "documentaire-voix-oubliees",
      title: "Documentaire « Voix Oubliées »",
      summary: "Produire un documentaire sur les artisans qui préservent des savoir-faire anciens.",
      description:
        "« Voix Oubliées » est un documentaire indépendant qui part à la rencontre d'artisans dont les métiers disparaissent. Votre soutien finance le tournage, le montage et la diffusion en accès libre.",
      category: "creatif",
      imageUrl: "/campaigns/creatif.png",
      videoUrl: "/campaigns/creatif.mp4",
      goal: 900_000,
      raised: 210_000,
      ownerId: "u_marie",
      ownerName: "Marie Laurent",
      status: "pending",
      boosted: false,
      rewards: [
        { id: "r1", title: "Générique", description: "Votre nom au générique du film.", amount: 5000 },
        { id: "r2", title: "Projection privée", description: "Invitation à l'avant-première.", amount: 15000 },
      ],
      createdAt: new Date(now - day * 3).toISOString(),
      deadline: new Date(now + day * 80).toISOString(),
    },
  ]

  const donations: Donation[] = [
    {
      id: "d1",
      campaignId: "c_sante",
      campaignTitle: campaigns[0].title,
      userId: "u_marie",
      donorName: "Marie Laurent",
      amount: 5000,
      message: "Courage à toute l'équipe !",
      anonymous: false,
      recurring: false,
      status: "succeeded",
      createdAt: new Date(now - day * 2).toISOString(),
    },
    {
      id: "d2",
      campaignId: "c_urgence",
      campaignTitle: campaigns[2].title,
      userId: null,
      donorName: "Anonyme",
      amount: 10000,
      anonymous: true,
      recurring: false,
      status: "succeeded",
      createdAt: new Date(now - day * 1).toISOString(),
    },
    {
      id: "d3",
      campaignId: "c_education",
      campaignTitle: campaigns[1].title,
      userId: "u_karim",
      donorName: "Karim Benali",
      amount: 2500,
      message: "Bravo pour cette belle initiative.",
      anonymous: false,
      recurring: true,
      status: "succeeded",
      createdAt: new Date(now - day * 4).toISOString(),
    },
  ]

  const wallet: WalletTx[] = [
    {
      id: "w1",
      userId: "u_karim",
      type: "donation_in",
      amount: 324_0000,
      label: "Dons reçus — Soins pédiatriques",
      createdAt: new Date(now - day * 2).toISOString(),
    },
    {
      id: "w2",
      userId: "u_karim",
      type: "boost",
      amount: -2000,
      label: "Boost campagne — Aide d'urgence",
      createdAt: new Date(now - day * 3).toISOString(),
    },
    {
      id: "w3",
      userId: "u_marie",
      type: "topup",
      amount: 4500,
      label: "Rechargement du portefeuille",
      createdAt: new Date(now - day * 6).toISOString(),
    },
  ]

  const notifications: AppNotification[] = [
    {
      id: "n1",
      userId: "u_karim",
      title: "Nouveau don reçu",
      body: "Marie Laurent a fait un don de 50,00 € à « Soins pédiatriques ».",
      read: false,
      createdAt: new Date(now - day * 2).toISOString(),
    },
    {
      id: "n2",
      userId: "u_marie",
      title: "Objectif proche !",
      body: "Votre campagne « École numérique » a atteint 75 % de son objectif.",
      read: false,
      createdAt: new Date(now - day * 1).toISOString(),
    },
  ]

  return { users, campaigns, donations, wallet, notifications }
}

export function getStore(): Store {
  if (!g.__givokStore) {
    g.__givokStore = seed()
  }
  return g.__givokStore
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}
