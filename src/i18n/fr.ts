import type { Messages } from "./types";

const fr: Messages = {
  localeName: "Français",

  seo: {
    title: "This is AIT · Agentic IT — auto-hébergée, open source",
    description:
      "Une nouvelle catégorie d'infrastructure — auto-hébergée, agentique, open source. Un stack, quarante services, zéro SaaS.",
  },

  header: {
    homeAria: "This is AIT — accueil",
    nav: {
      manifesto: "Manifeste",
      stack: "Stack",
      useCases: "Ce qu'il remplace",
      engine: "nOS",
      getInvolved: "Participer",
    },
    themeSwitchToLight: "Passer en mode clair",
    themeSwitchToDark: "Passer en mode sombre",
    star: "Star",
    language: "Langue",
  },

  hero: {
    tagline:
      "Voici AIT. Une nouvelle catégorie d'infrastructure auto-hébergée, agentique, open source.",
    subTagline: "Un seul stack. Quarante services. Zéro abonnement SaaS.",
    scrollHintAria: "Faire défiler vers la section suivante",
  },

  problem: {
    kicker: "Le problème",
    title: "Tu paies un loyer pour ta propre vie numérique.",
    cards: {
      saasTax: {
        headline: "Impôt SaaS",
        body: "Notion. GitHub. 1Password. Vercel. Grafana Cloud. Auth0. Slack. Zoom. Ensemble : 200–500 $ chaque mois. À vie.",
      },
      lockin: {
        headline: "Vendor lock-in",
        body: "Tes données vivent sur la machine d'un autre. L'export est toujours plus dur que l'import. La sortie, c'est le produit.",
      },
      watched: {
        headline: "Toujours connecté, toujours surveillé",
        body: "Chaque frappe quitte ton bâtiment. Chaque fonction peut être retirée. Chaque prix peut monter.",
      },
    },
  },

  manifesto: {
    kicker: "Manifeste",
    title: "Le mainframe est rentré à la maison.",
    paragraphs: [
      "Dans les années 60, une machine servait tout le monde. Puis le PC a décentralisé le calcul — la puissance est arrivée sur ton bureau. Puis le cloud l'a re-centralisée — la puissance est repartie dans un datacenter lointain.",
      "Aujourd'hui Apple Silicon surpasse les serveurs rackés d'il y a dix ans. Docker a standardisé le déploiement. Ansible a rendu l'infrastructure reproductible. Les LLM locaux rendent possible un agent DevOps intégré.",
      "%STRONG_START%AIT — Agentic IT —%STRONG_END% est l'effondrement de cet arc. Une machine sur ton bureau, qui fait tourner toute ta vie numérique. Auto-hébergée. Auto-mise à jour. Auto-gérée. Open source de bout en bout.",
    ],
    closing:
      "Ce n'est pas un passe-temps homelab. C'est la prochaine catégorie d'infrastructure.",
    timeline: [
      { era: "Années 60", label: "Mainframe", note: "une machine, tout le monde" },
      { era: "Années 80", label: "PC", note: "la puissance sur le bureau" },
      { era: "Années 2000", label: "Internet", note: "le web arrive" },
      { era: "Années 2010", label: "Cloud", note: "la puissance chez un autre" },
      { era: "Années 2020", label: "Auto-hébergé", note: "retour au bureau" },
      { era: "AUJOURD'HUI", label: "AIT", note: "auto-géré, agentique" },
    ],
  },

  stack: {
    kicker: "Le stack",
    title: "Quarante services. Un stack. Tout en open source.",
    subtitle:
      "Chaque logo ci-dessous est un projet FOSS que nous intégrons, orchestrons et sécurisons ensemble — pour que tu n'aies pas à le faire.",
    categories: {
      Infrastructure: "Infrastructure",
      Observability: "Observabilité",
      Productivity: "Productivité",
      DevOps: "DevOps",
      "Media & Home": "Médias & maison",
      "AI & Agentic": "IA & agentique",
      Business: "Entreprise",
      Communication: "Communication",
      Engineering: "Ingénierie",
    },
  },

  useCases: {
    kicker: "Ce qu'il remplace",
    title: "Remplace ton cloud, un onglet à la fois.",
    colSaas: "Ce que tu paies",
    colFoss: "Ce que tu peux auto-héberger",
    colPrice: "Facture mensuelle",
    summaryTypical: "Un stack typique",
    summaryAit: "AIT",
    perMonth: "/mois",
    footnote:
      "Matériel et électricité non inclus. Un Mac Mini M4 se rembourse en moins d'un an pour un power user typique.",
  },

  engine: {
    kicker: "Sous le capot",
    title: "Le moteur : nOS.",
    subtitle: "La couche d'intégration, c'est le produit.",
    para1:
      "Chaque service FOSS fonctionne isolément. La partie difficile — et celle qui coûte des millions aux équipes d'ingénierie — c'est de les faire marcher ensemble : un login, une piste d'audit, une stratégie de sauvegarde, un processus de mise à jour.",
    para2:
      "nOS est le moteur d'intégration open source derrière AIT. C'est un playbook Ansible qui orchestre 45 rôles, relie 40+ services via Authentik SSO, et donne au stack entier une reproductibilité vérifiable :",
    terminalAriaLabel: "Exemple de commande terminal",
    terminalLines: [
      "Efface tout",
      "Installe tout",
      "Intègre tout",
      "Sécurise tout",
    ],
    terminalFooter: "Durée : ~20 minutes. Une seule fois.",
    features: [
      { n: "45", label: "rôles Ansible", note: "chaque service a son rôle" },
      { n: "SSO", label: "partout", note: "OIDC + forward-auth, sans exception" },
      { n: "4", label: "niveaux RBAC", note: "admin / manager / user / guest" },
      { n: "ARM64", label: "Apple Silicon", note: "inférence accélérée par MLX" },
    ],
  },

  values: {
    kicker: "Principes",
    title: "Non négociable.",
    items: [
      { title: "100 % FOSS.", body: "Aucune dépendance propriétaire. Forkable dès le premier jour." },
      { title: "Auto-hébergé par défaut.", body: "Tes données ne quittent jamais ta machine." },
      { title: "Reproductible.", body: "Une seule commande, à chaque fois. Pas de flocons." },
      { title: "Agentique.", body: "Le stack s'entretient tout seul, pour que tu n'aies pas à le faire." },
    ],
  },

  cta: {
    kicker: "Participer",
    title: "Participe au projet.",
    subtitle:
      "On est tôt. Le repo est public. La catégorie n'est pas encore écrite.",
    star: {
      title: "Mets une star au repo",
      body: "Aide-nous à atteindre les 1 000 premières stars. C'est comme ça que l'open source se fait trouver.",
      button: "Star sur GitHub",
      starsAria: (n) => `Stars actuelles : ${n}`,
    },
    coffee: {
      title: "Offre-moi un café",
      body: "Tout ça est construit la nuit et le week-end. Un café garde le playbook en vie.",
      button: "Offrir un café",
    },
    secondaryMuted: "Docs · Twitter · Matrix · RSS — bientôt.",
    secondaryAria: "Liens secondaires",
    readDocs: "Lire la doc",
    followTwitter: "Suivre sur Twitter/X",
    joinMatrix: "Rejoindre le Matrix",
    rss: "RSS",
  },

  footer: {
    tagline: "This is AIT. — Agentic IT, édition manifeste.",
    license: "Licence MIT. Fait sur un M4 Pro.",
    copy: (year) => `© ${year} thisisait.eu — construit par des humains, maintenu par des agents.`,
  },
};

export default fr;
