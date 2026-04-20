import type { Messages } from "./types";

const cs: Messages = {
  localeName: "Čeština",

  header: {
    homeAria: "This is AIT — domů",
    nav: {
      manifesto: "Manifest",
      stack: "Stack",
      useCases: "Co to nahradí",
      engine: "nOS",
      getInvolved: "Zapojit se",
    },
    themeSwitchToLight: "Přepnout na světlý režim",
    themeSwitchToDark: "Přepnout na tmavý režim",
    star: "Hvězda",
    language: "Jazyk",
  },

  hero: {
    tagline:
      "Tohle je AIT. Nová kategorie self-hosted, agentní, open-source infrastruktury.",
    subTagline: "Jeden stack. Čtyřicet služeb. Nula SaaS účtů.",
    scrollHintAria: "Posunout na další sekci",
  },

  problem: {
    kicker: "Problém",
    title: "Platíš nájem za svůj vlastní digitální život.",
    cards: {
      saasTax: {
        headline: "SaaS daň",
        body: "Notion. GitHub. 1Password. Vercel. Grafana Cloud. Auth0. Slack. Zoom. Dohromady: 200–500 $ každý měsíc. Navždy.",
      },
      lockin: {
        headline: "Vendor lock-in",
        body: "Tvá data žijí na cizím stroji. Export je vždy těžší než import. Cesta ven je součást produktu.",
      },
      watched: {
        headline: "Pořád online, pořád sledovaný",
        body: "Každý stisk klávesy opouští tvou budovu. Každou funkci ti mohou vzít. Každou cenu mohou zvýšit.",
      },
    },
  },

  manifesto: {
    kicker: "Manifest",
    title: "Mainframe se vrátil domů.",
    paragraphs: [
      "V šedesátkách sloužil jeden stroj všem. Pak PC decentralizovaly výpočet — moc přišla na tvůj stůl. Pak ji cloud zase centralizoval — moc se vrátila do cizího datacentra.",
      "Dnes Apple Silicon dá na kolena rackové servery z před deseti let. Docker standardizoval nasazení. Ansible udělal infrastrukturu reprodukovatelnou. Lokální LLM umožnily mít zabudovaného DevOps agenta.",
      "%STRONG_START%AIT — Agentic IT —%STRONG_END% je zhroucení celého toho oblouku. Jeden stroj na tvém stole, běží na něm celý tvůj digitální život. Self-hosted. Sebe-updatující. Sebe-řídící. Open source od začátku do konce.",
    ],
    closing:
      "Tohle není homelab koníček. Tohle je další kategorie infrastruktury.",
    timeline: [
      { era: "60. léta", label: "Mainframe", note: "jeden stroj, všichni" },
      { era: "80. léta", label: "PC", note: "moc na stůl" },
      { era: "00. léta", label: "Internet", note: "vzniká web" },
      { era: "10. léta", label: "Cloud", note: "moc pro někoho jiného" },
      { era: "20. léta", label: "Self-hosted", note: "zpátky na stůl" },
      { era: "TEĎ", label: "AIT", note: "sebe-řídící, agentní" },
    ],
  },

  stack: {
    kicker: "Stack",
    title: "Čtyřicet služeb. Jeden stack. Všechno open source.",
    subtitle:
      "Každé logo níže je FOSS projekt, který integrujeme, orchestrujeme a zabezpečujeme dohromady — abys nemusel ty.",
  },

  useCases: {
    kicker: "Co to nahradí",
    title: "Nahraď svůj cloud, jeden tab po druhém.",
    colSaas: "Za co platíš",
    colFoss: "Co si můžeš self-hostovat",
    colPrice: "Měsíční účet",
    summaryTypical: "Typický stack",
    summaryAit: "AIT",
    perMonth: "/měsíc",
    footnote:
      "Hardware a elektřina nejsou započítány. Mac Mini M4 se typickému power userovi zaplatí za méně než rok.",
  },

  engine: {
    kicker: "Pod kapotou",
    title: "Motor: nOS.",
    subtitle: "Integrační vrstva je produkt.",
    para1:
      "Každá FOSS služba funguje sama o sobě. Těžká část — a ta, která stojí inženýrské týmy miliony — je rozchodit je dohromady: jeden login, jedna audit stopa, jedna strategie záloh, jeden proces upgradů.",
    para2:
      "nOS je open-source integrační motor za AIT. Je to Ansible playbook, který orchestruje 45 rolí, propojuje 40+ služeb přes Authentik SSO a dává celému stacku reprodukovatelnost, kterou si můžeš ověřit:",
    terminalAriaLabel: "Ukázkový terminálový příkaz",
    features: [
      { n: "45", label: "Ansible rolí", note: "každá služba má svou roli" },
      { n: "SSO", label: "všude", note: "OIDC + forward-auth, bez výjimek" },
      { n: "4", label: "úrovně RBAC", note: "admin / manager / user / guest" },
      { n: "ARM64", label: "Apple Silicon", note: "inference akcelerovaná MLX" },
    ],
  },

  values: {
    kicker: "Principy",
    title: "Nevyjednatelné.",
    items: [
      { title: "100% FOSS.", body: "Žádné proprietární závislosti. Forknutelné od prvního dne." },
      { title: "Self-hosted defaultně.", body: "Tvá data nikdy neopustí tvůj stroj." },
      { title: "Reprodukovatelné.", body: "Jeden příkaz, vždy. Žádné sněhové vločky." },
      { title: "Agentní.", body: "Stack se udržuje sám, ať to nemusíš dělat ty." },
    ],
  },

  cta: {
    kicker: "Zapojit se",
    title: "Buď u toho.",
    subtitle:
      "Jsme na začátku. Repo je veřejné. Kategorie ještě není napsaná.",
    star: {
      title: "Hvězda pro repo",
      body: "Pomoz nám dorazit na prvních 1 000 hvězd. Open-source se takhle dostává k lidem.",
      button: "Hvězda na GitHubu",
      starsAria: (n) => `Aktuální počet hvězd: ${n}`,
    },
    coffee: {
      title: "Kup mi kafe",
      body: "Tohle se staví po nocích a o víkendech. Kafe drží playbook naživu.",
      button: "Kup mi kafe",
    },
    secondaryMuted: "Docs · Twitter · Matrix · RSS — brzy.",
    secondaryAria: "Sekundární odkazy",
    readDocs: "Dokumentace",
    followTwitter: "Sleduj na Twitter/X",
    joinMatrix: "Připoj se na Matrix",
    rss: "RSS",
  },

  footer: {
    tagline: "This is AIT. — Agentic IT, manifestové vydání.",
    license: "MIT licence. Postaveno na M4 Pro.",
    copy: (year) => `© ${year} thisisait.eu — stavěno lidmi, udržováno agenty.`,
  },
};

export default cs;
