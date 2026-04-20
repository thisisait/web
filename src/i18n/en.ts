import type { Messages } from "./types";

const en: Messages = {
  localeName: "English",

  seo: {
    title: "This is AIT · Agentic IT — self-hosted, open source",
    description:
      "A new category of infrastructure — self-hosted, agentic, open source. One stack. Forty services. Zero SaaS bills.",
  },

  header: {
    homeAria: "This is AIT — home",
    nav: {
      manifesto: "Manifesto",
      stack: "Stack",
      useCases: "What it replaces",
      engine: "nOS",
      getInvolved: "Get involved",
    },
    themeSwitchToLight: "Switch to light mode",
    themeSwitchToDark: "Switch to dark mode",
    star: "Star",
    language: "Language",
  },

  hero: {
    tagline:
      "This is AIT. A new category of self-hosted, agentic, open-source infrastructure.",
    subTagline: "One stack. Forty services. Zero SaaS bills.",
    scrollHintAria: "Scroll to next section",
  },

  problem: {
    kicker: "The problem",
    title: "You're paying rent on your own digital life.",
    cards: {
      saasTax: {
        headline: "SaaS tax",
        body: "Notion. GitHub. 1Password. Vercel. Grafana Cloud. Auth0. Slack. Zoom. Together: $200–$500 every month. Forever.",
      },
      lockin: {
        headline: "Vendor lock-in",
        body: "Your data lives on someone else's machine. Export is always harder than import. The exit ramp is the product.",
      },
      watched: {
        headline: "Always online, always watched",
        body: "Every keystroke leaves your building. Every feature can be revoked. Every price can rise.",
      },
    },
  },

  manifesto: {
    kicker: "Manifesto",
    title: "The mainframe came home.",
    paragraphs: [
      "In the 1960s, one machine served everyone. Then PCs decentralized computing — power came to your desk. Then the cloud re-centralized it — power went back to someone else's datacenter.",
      "Now Apple Silicon runs circles around the rack-mounted servers of a decade ago. Docker standardized deployment. Ansible made infrastructure reproducible. Local LLMs made a built-in DevOps agent possible.",
      "%STRONG_START%AIT — Agentic IT —%STRONG_END% is the collapse of that arc. One machine on your desk, running your entire digital life. Self-hosted. Self-updating. Self-managing. Open source end-to-end.",
    ],
    closing:
      "This isn't a homelab hobby. It's the next category of infrastructure.",
    timeline: [
      { era: "1960s", label: "Mainframe", note: "one machine, everyone" },
      { era: "1980s", label: "PC", note: "power to the desk" },
      { era: "2000s", label: "Internet", note: "the web happens" },
      { era: "2010s", label: "Cloud", note: "power to someone else" },
      { era: "2020s", label: "Self-hosted", note: "back to the desk" },
      { era: "NOW", label: "AIT", note: "self-managing, agentic" },
    ],
  },

  stack: {
    kicker: "The stack",
    title: "Forty services. One stack. All open source.",
    subtitle:
      "Every logo below is a FOSS project we integrate, orchestrate, and secure together so you don't have to.",
    categories: {
      Infrastructure: "Infrastructure",
      Observability: "Observability",
      Productivity: "Productivity",
      DevOps: "DevOps",
      "Media & Home": "Media & Home",
      "AI & Agentic": "AI & Agentic",
      Business: "Business",
      Communication: "Communication",
      Engineering: "Engineering",
    },
  },

  useCases: {
    kicker: "What it replaces",
    title: "Replace your cloud, one tab at a time.",
    colSaas: "You're paying for",
    colFoss: "You could self-host",
    colPrice: "Monthly bill",
    summaryTypical: "A typical stack",
    summaryAit: "AIT",
    perMonth: "/month",
    footnote:
      "Hardware and electricity not included. A Mac Mini M4 pays for itself in under a year for a typical power user.",
  },

  engine: {
    kicker: "Under the hood",
    title: "The engine: nOS.",
    subtitle: "The integration layer is the product.",
    para1:
      "Every FOSS service works in isolation. The hard part — and the part that costs engineering teams millions — is making them work together: one login, one audit trail, one backup strategy, one upgrade process.",
    para2:
      "nOS is the open-source integration engine behind AIT. It's an Ansible playbook that orchestrates 45 roles, wires 40+ services together through Authentik SSO, and gives the whole stack reproducibility you can verify:",
    terminalAriaLabel: "Example terminal command",
    terminalLines: [
      "Wipes everything",
      "Installs everything",
      "Integrates everything",
      "Secures everything",
    ],
    terminalFooter: "Time: ~20 minutes. Once.",
    features: [
      { n: "45", label: "Ansible roles", note: "every service owned by a role" },
      { n: "SSO", label: "everywhere", note: "OIDC + forward-auth, no exceptions" },
      { n: "4", label: "RBAC tiers", note: "admin / manager / user / guest" },
      { n: "ARM64", label: "Apple Silicon", note: "MLX-accelerated inference" },
    ],
  },

  values: {
    kicker: "Principles",
    title: "Non-negotiables.",
    items: [
      { title: "100% FOSS.", body: "No proprietary dependencies. Forkable on day one." },
      { title: "Self-hosted by default.", body: "Your data never leaves your machine." },
      { title: "Reproducible.", body: "One command, every time. No snowflakes." },
      { title: "Agentic.", body: "The stack maintains itself so you don't have to." },
    ],
  },

  cta: {
    kicker: "Get involved",
    title: "Be part of this.",
    subtitle:
      "We're early. The repo is public. The category is not written yet.",
    star: {
      title: "Star the repo",
      body: "Help us reach the first 1,000 stars. It's how open-source gets found.",
      button: "Star on GitHub",
      starsAria: (n) => `Current stars: ${n}`,
    },
    coffee: {
      title: "Buy me a coffee",
      body: "This is built nights and weekends. A coffee keeps the playbook alive.",
      button: "Buy me a coffee",
    },
    secondaryMuted: "Docs · Twitter · Matrix · RSS — coming soon.",
    secondaryAria: "Secondary links",
    readDocs: "Read the docs",
    followTwitter: "Follow on Twitter/X",
    joinMatrix: "Join the Matrix channel",
    rss: "RSS",
  },

  footer: {
    tagline: "This is AIT. — Agentic IT, manifesto edition.",
    license: "MIT Licensed. Made on an M4 Pro.",
    copy: (year) => `© ${year} thisisait.eu — built by humans, maintained by agents.`,
  },
};

export default en;
