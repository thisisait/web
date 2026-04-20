import type { Messages } from "./types";

const cs: Messages = {
  localeName: "Čeština",

  seo: {
    title: "This is AIT · Agentic IT — self-hosted, open source",
    description:
      "Nová kategorie infrastruktury — self-hosted, agentní, open source. Jeden stack, čtyřicet služeb, nula SaaS předplatných.",
  },

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
      "Tohle je AIT. Nová kategorie infrastruktury — self-hosted, agentní, open-source.",
    subTagline: "Jeden stack. Čtyřicet služeb. Žádné SaaS předplatné.",
    scrollHintAria: "Přejít na další sekci",
  },

  problem: {
    kicker: "Problém",
    title: "Platíš nájem za svůj vlastní digitální život.",
    cards: {
      saasTax: {
        headline: "SaaS daň",
        body: "Notion. GitHub. 1Password. Vercel. Grafana Cloud. Auth0. Slack. Zoom. Dohromady: 200–500 $ měsíčně. Napořád.",
      },
      lockin: {
        headline: "Vendor lock-in",
        body: "Tvoje data žijí na cizím serveru. Export je vždycky těžší než import — východ z produktu je totiž sám produkt.",
      },
      watched: {
        headline: "Pořád online, pořád sledovaný",
        body: "Každý stisk klávesy opouští tvou síť. Každou funkci ti můžou vzít. Každou cenu můžou zvednout.",
      },
    },
  },

  manifesto: {
    kicker: "Manifest",
    title: "Mainframe se vrátil domů.",
    paragraphs: [
      "V šedesátých letech sloužil jeden stroj všem. Pak PC rozprostřela výpočetní výkon — moc se stěhovala na tvůj stůl. Pak ji cloud znovu centralizoval — moc odešla do cizího datacentra.",
      "Dnes Apple Silicon nechává rackové servery z minulé dekády daleko za sebou. Docker standardizoval nasazení. Ansible dal infrastruktuře reprodukovatelnost. Lokální LLM umožnily DevOps agenta přímo uvnitř stacku.",
      "%STRONG_START%AIT — Agentic IT —%STRONG_END% je finální zhroucení toho oblouku. Jeden stroj na stole, běží na něm celý tvůj digitální život. Self-hosted. Sám se aktualizuje. Sám se spravuje. Open source od začátku do konce.",
    ],
    closing:
      "Tohle není homelab koníček. Je to další kategorie infrastruktury.",
    timeline: [
      { era: "60. léta", label: "Mainframe", note: "jeden stroj, všichni" },
      { era: "80. léta", label: "PC", note: "moc přichází na stůl" },
      { era: "00. léta", label: "Internet", note: "přichází web" },
      { era: "10. léta", label: "Cloud", note: "moc patří někomu jinému" },
      { era: "20. léta", label: "Self-hosted", note: "zpátky na stůl" },
      { era: "DNES", label: "AIT", note: "sám se spravuje, agentní" },
    ],
  },

  stack: {
    kicker: "Stack",
    title: "Čtyřicet služeb. Jeden stack. Celý v open source.",
    subtitle:
      "Každé logo níže je FOSS projekt, který za tebe zintegrujeme, zorchestrujeme a zabezpečíme.",
    categories: {
      Infrastructure: "Infrastruktura",
      Observability: "Monitoring",
      Productivity: "Produktivita",
      DevOps: "DevOps",
      "Media & Home": "Média & domov",
      "AI & Agentic": "AI & agenti",
      Business: "Byznys",
      Communication: "Komunikace",
      Engineering: "Inženýrství",
    },
  },

  useCases: {
    kicker: "Co to nahradí",
    title: "Nahraď cloud, jeden tab po druhém.",
    colSaas: "Za co platíš",
    colFoss: "Čím to nahradíš",
    colPrice: "Účet za měsíc",
    summaryTypical: "Typický stack",
    summaryAit: "AIT",
    perMonth: "/měsíc",
    footnote:
      "Hardware a elektřinu nepočítáme. Mac Mini M4 se typickému power userovi vrátí do roka.",
  },

  engine: {
    kicker: "Pod kapotou",
    title: "Motor: nOS.",
    subtitle: "Integrační vrstva je samotný produkt.",
    para1:
      "Každá FOSS služba sama o sobě funguje. Těžká část — ta, která inženýrské týmy stojí miliony — je dostat je dohromady: jeden login, jedna audit stopa, jedna záloha, jeden upgrade.",
    para2:
      "nOS je open-source integrační motor za AIT. Ansible playbook, který orchestruje 45 rolí, provazuje přes 40 služeb přes Authentik SSO a dává celému stacku reprodukovatelnost, kterou si můžeš ověřit:",
    terminalAriaLabel: "Ukázka příkazu v terminálu",
    terminalLines: [
      "Všechno smaže",
      "Všechno nainstaluje",
      "Všechno propojí",
      "Všechno zabezpečí",
    ],
    terminalFooter: "Čas: ~20 minut. Jednou.",
    features: [
      { n: "45", label: "Ansible rolí", note: "každá služba má svou roli" },
      { n: "SSO", label: "všude", note: "OIDC + forward-auth, bez výjimek" },
      { n: "4", label: "úrovně RBAC", note: "admin / manager / user / guest" },
      { n: "ARM64", label: "Apple Silicon", note: "MLX akcelerovaná inference" },
    ],
  },

  values: {
    kicker: "Principy",
    title: "Bez kompromisů.",
    items: [
      { title: "100 % FOSS.", body: "Žádné proprietární závislosti. Forknutelné od prvního dne." },
      { title: "Self-hosted defaultně.", body: "Tvoje data nikdy neopustí tvůj stroj." },
      { title: "Reprodukovatelné.", body: "Jeden příkaz, pokaždé stejně. Žádné snowflakes." },
      { title: "Agentní.", body: "Stack se udržuje sám, aby ses o něj nemusel starat ty." },
    ],
  },

  cta: {
    kicker: "Zapojit se",
    title: "Buď u toho.",
    subtitle:
      "Teprve začínáme. Repo je veřejné. Tahle kategorie se teprve píše.",
    star: {
      title: "Dej hvězdu repu",
      body: "Pomoz nám na prvních 1 000 hvězd. Takhle se open source dostává k lidem.",
      button: "Hvězda na GitHubu",
      starsAria: (n) => `Aktuální počet hvězd: ${n}`,
    },
    coffee: {
      title: "Kup mi kafe",
      body: "Tohle vzniká po nocích a o víkendech. Kafe drží playbook naživu.",
      button: "Kup mi kafe",
    },
    secondaryMuted: "Docs · Twitter · Matrix · RSS — brzy.",
    secondaryAria: "Vedlejší odkazy",
    readDocs: "Dokumentace",
    followTwitter: "Twitter/X",
    joinMatrix: "Matrix",
    rss: "RSS",
  },

  footer: {
    tagline: "This is AIT. — Agentic IT, manifestové vydání.",
    license: "MIT licence. Postaveno na M4 Pro.",
    copy: (year) => `© ${year} thisisait.eu — staví lidé, udržují agenti.`,
  },
};

export default cs;
