import type { Messages } from "./types";

const de: Messages = {
  localeName: "Deutsch",

  header: {
    homeAria: "This is AIT — Startseite",
    nav: {
      manifesto: "Manifest",
      stack: "Stack",
      useCases: "Was es ersetzt",
      engine: "nOS",
      getInvolved: "Mitmachen",
    },
    themeSwitchToLight: "Zu hellem Modus wechseln",
    themeSwitchToDark: "Zu dunklem Modus wechseln",
    star: "Star",
    language: "Sprache",
  },

  hero: {
    tagline:
      "Das ist AIT. Eine neue Kategorie selbstgehosteter, agentischer Open-Source-Infrastruktur.",
    subTagline: "Ein Stack. Vierzig Dienste. Null SaaS-Rechnungen.",
    scrollHintAria: "Zum nächsten Abschnitt scrollen",
  },

  problem: {
    kicker: "Das Problem",
    title: "Du zahlst Miete auf dein eigenes digitales Leben.",
    cards: {
      saasTax: {
        headline: "SaaS-Steuer",
        body: "Notion. GitHub. 1Password. Vercel. Grafana Cloud. Auth0. Slack. Zoom. Zusammen: 200–500 $ jeden Monat. Für immer.",
      },
      lockin: {
        headline: "Vendor-Lock-in",
        body: "Deine Daten leben auf der Maschine eines anderen. Exportieren ist immer schwerer als Importieren. Der Ausgang ist das Produkt.",
      },
      watched: {
        headline: "Immer online, immer beobachtet",
        body: "Jeder Tastendruck verlässt dein Gebäude. Jedes Feature kann entzogen werden. Jeder Preis kann steigen.",
      },
    },
  },

  manifesto: {
    kicker: "Manifest",
    title: "Der Mainframe ist nach Hause gekommen.",
    paragraphs: [
      "In den 1960ern bediente eine Maschine alle. Dann dezentralisierten PCs das Rechnen — die Macht kam auf deinen Schreibtisch. Dann zentralisierte die Cloud sie wieder — die Macht zog in ein fremdes Rechenzentrum.",
      "Heute übertrifft Apple Silicon die Rack-Server von vor zehn Jahren mühelos. Docker standardisierte Deployment. Ansible machte Infrastruktur reproduzierbar. Lokale LLMs ermöglichen einen eingebauten DevOps-Agenten.",
      "%STRONG_START%AIT — Agentic IT —%STRONG_END% ist der Zusammenbruch dieses Bogens. Eine Maschine auf deinem Schreibtisch, die dein ganzes digitales Leben trägt. Selbstgehostet. Selbstaktualisierend. Selbstverwaltend. Open Source von Anfang bis Ende.",
    ],
    closing:
      "Das ist kein Homelab-Hobby. Das ist die nächste Kategorie von Infrastruktur.",
    timeline: [
      { era: "1960er", label: "Mainframe", note: "eine Maschine, alle" },
      { era: "1980er", label: "PC", note: "Macht auf den Schreibtisch" },
      { era: "2000er", label: "Internet", note: "das Web passiert" },
      { era: "2010er", label: "Cloud", note: "Macht zu jemand anderem" },
      { era: "2020er", label: "Selbstgehostet", note: "zurück zum Schreibtisch" },
      { era: "JETZT", label: "AIT", note: "selbstverwaltend, agentisch" },
    ],
  },

  stack: {
    kicker: "Der Stack",
    title: "Vierzig Dienste. Ein Stack. Alles Open Source.",
    subtitle:
      "Jedes Logo unten ist ein FOSS-Projekt, das wir integrieren, orchestrieren und absichern — damit du es nicht musst.",
  },

  useCases: {
    kicker: "Was es ersetzt",
    title: "Ersetze deine Cloud, Tab für Tab.",
    colSaas: "Wofür du zahlst",
    colFoss: "Was du selbst hosten könntest",
    colPrice: "Monatliche Rechnung",
    summaryTypical: "Ein typischer Stack",
    summaryAit: "AIT",
    perMonth: "/Monat",
    footnote:
      "Hardware und Strom nicht inbegriffen. Ein Mac Mini M4 zahlt sich für typische Power-User in weniger als einem Jahr aus.",
  },

  engine: {
    kicker: "Unter der Haube",
    title: "Der Motor: nOS.",
    subtitle: "Die Integrationsschicht ist das Produkt.",
    para1:
      "Jeder FOSS-Dienst funktioniert für sich. Der schwierige Teil — und der, der Engineering-Teams Millionen kostet — ist, sie zusammen arbeiten zu lassen: ein Login, ein Audit-Trail, eine Backup-Strategie, ein Upgrade-Prozess.",
    para2:
      "nOS ist die Open-Source-Integrationsmaschine hinter AIT. Es ist ein Ansible-Playbook, das 45 Rollen orchestriert, 40+ Dienste über Authentik-SSO verbindet und dem ganzen Stack eine nachprüfbare Reproduzierbarkeit gibt:",
    terminalAriaLabel: "Beispiel-Terminalbefehl",
    features: [
      { n: "45", label: "Ansible-Rollen", note: "jeder Dienst hat seine Rolle" },
      { n: "SSO", label: "überall", note: "OIDC + Forward-Auth, ohne Ausnahme" },
      { n: "4", label: "RBAC-Stufen", note: "Admin / Manager / User / Gast" },
      { n: "ARM64", label: "Apple Silicon", note: "MLX-beschleunigte Inferenz" },
    ],
  },

  values: {
    kicker: "Prinzipien",
    title: "Nicht verhandelbar.",
    items: [
      { title: "100 % FOSS.", body: "Keine proprietären Abhängigkeiten. Forkbar ab Tag eins." },
      { title: "Selbstgehostet standardmäßig.", body: "Deine Daten verlassen deine Maschine nie." },
      { title: "Reproduzierbar.", body: "Ein Befehl, jedes Mal. Keine Schneeflocken." },
      { title: "Agentisch.", body: "Der Stack wartet sich selbst, damit du es nicht musst." },
    ],
  },

  cta: {
    kicker: "Mitmachen",
    title: "Sei dabei.",
    subtitle:
      "Wir stehen am Anfang. Das Repo ist öffentlich. Die Kategorie ist noch nicht geschrieben.",
    star: {
      title: "Repo mit Star versehen",
      body: "Hilf uns, die ersten 1 000 Stars zu erreichen. So wird Open Source gefunden.",
      button: "Auf GitHub mit Star versehen",
      starsAria: (n) => `Aktuelle Stars: ${n}`,
    },
    coffee: {
      title: "Lade mir einen Kaffee ein",
      body: "Das hier entsteht nachts und an Wochenenden. Ein Kaffee hält das Playbook am Leben.",
      button: "Einen Kaffee spendieren",
    },
    secondaryMuted: "Docs · Twitter · Matrix · RSS — bald verfügbar.",
    secondaryAria: "Weitere Links",
    readDocs: "Dokumentation lesen",
    followTwitter: "Auf Twitter/X folgen",
    joinMatrix: "Matrix-Channel beitreten",
    rss: "RSS",
  },

  footer: {
    tagline: "This is AIT. — Agentic IT, Manifest-Ausgabe.",
    license: "MIT-Lizenz. Gebaut auf einem M4 Pro.",
    copy: (year) => `© ${year} thisisait.eu — gebaut von Menschen, gewartet von Agenten.`,
  },
};

export default de;
