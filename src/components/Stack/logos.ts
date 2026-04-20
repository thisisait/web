// Registry of FOSS projects shown in the Stack section.
// TODO: drop real SVGs into src/assets/logos/ and wire them via the `svg` field.
// As long as `svg` is undefined, LogoTile renders a monogram placeholder.

export type LogoCategory =
  | "Infrastructure"
  | "Observability"
  | "Productivity"
  | "DevOps"
  | "Media & Home"
  | "AI & Agentic"
  | "Business"
  | "Communication"
  | "Engineering";

export interface Logo {
  name: string;
  category: LogoCategory;
  /** One-line tagline shown on hover. */
  blurb: string;
  /** Optional import URL for an SVG logo asset. */
  svg?: string;
  /** Optional brand accent color for the monogram placeholder. */
  tint?: string;
}

export const LOGOS: Logo[] = [
  // Infrastructure
  { name: "Docker", category: "Infrastructure", blurb: "Container runtime", tint: "#2496ED" },
  { name: "MariaDB", category: "Infrastructure", blurb: "SQL database", tint: "#003545" },
  { name: "PostgreSQL", category: "Infrastructure", blurb: "SQL database", tint: "#336791" },
  { name: "Redis", category: "Infrastructure", blurb: "In-memory store", tint: "#DC382D" },
  { name: "Traefik", category: "Infrastructure", blurb: "Edge router", tint: "#24A1C1" },
  { name: "Portainer", category: "Infrastructure", blurb: "Container UI", tint: "#13BEF9" },
  { name: "Authentik", category: "Infrastructure", blurb: "SSO & identity", tint: "#FD4B2D" },
  { name: "Infisical", category: "Infrastructure", blurb: "Secrets vault", tint: "#000000" },
  { name: "Ansible", category: "Infrastructure", blurb: "Orchestration", tint: "#EE0000" },
  { name: "Bluesky PDS", category: "Infrastructure", blurb: "Personal data server", tint: "#0085FF" },

  // Observability
  { name: "Grafana", category: "Observability", blurb: "Dashboards", tint: "#F46800" },
  { name: "Prometheus", category: "Observability", blurb: "Metrics", tint: "#E6522C" },
  { name: "Loki", category: "Observability", blurb: "Logs", tint: "#F5A623" },
  { name: "Tempo", category: "Observability", blurb: "Traces", tint: "#F16528" },
  { name: "Alloy", category: "Observability", blurb: "Telemetry agent", tint: "#F16528" },

  // Productivity
  { name: "Nextcloud", category: "Productivity", blurb: "Files & collaboration", tint: "#0082C9" },
  { name: "Outline", category: "Productivity", blurb: "Team wiki", tint: "#0366D6" },
  { name: "WordPress", category: "Productivity", blurb: "Publishing", tint: "#21759B" },
  { name: "Vaultwarden", category: "Productivity", blurb: "Password manager", tint: "#175DDC" },
  { name: "n8n", category: "Productivity", blurb: "Workflow automation", tint: "#EA4B71" },
  { name: "Paperclip", category: "Productivity", blurb: "Document archive", tint: "#5A6A73" },

  // DevOps
  { name: "Gitea", category: "DevOps", blurb: "Git hosting", tint: "#609926" },
  { name: "GitLab", category: "DevOps", blurb: "Full DevOps platform", tint: "#FC6D26" },
  { name: "Woodpecker CI", category: "DevOps", blurb: "Continuous integration", tint: "#4CAF50" },

  // Media & Home
  { name: "Jellyfin", category: "Media & Home", blurb: "Media server", tint: "#00A4DC" },
  { name: "Kiwix", category: "Media & Home", blurb: "Offline knowledge", tint: "#1A1A2E" },
  { name: "Calibre-Web", category: "Media & Home", blurb: "E-book library", tint: "#45573E" },
  { name: "Home Assistant", category: "Media & Home", blurb: "Home automation", tint: "#18BCF2" },
  { name: "RustFS", category: "Media & Home", blurb: "Object storage", tint: "#DEA584" },
  { name: "Puter", category: "Media & Home", blurb: "Desktop in the browser", tint: "#363636" },

  // AI & Agentic
  { name: "Ollama", category: "AI & Agentic", blurb: "Local LLM runtime", tint: "#000000" },
  { name: "Open WebUI", category: "AI & Agentic", blurb: "Chat frontend", tint: "#6C63FF" },
  { name: "OpenClaw", category: "AI & Agentic", blurb: "Agentic operator (custom)", tint: "#E85A4F" },

  // Business
  { name: "ERPNext", category: "Business", blurb: "ERP / CRM", tint: "#0089FF" },
  { name: "FreeScout", category: "Business", blurb: "Help desk", tint: "#005EBB" },
  { name: "Metabase", category: "Business", blurb: "Analytics", tint: "#509EE3" },
  { name: "Apache Superset", category: "Business", blurb: "BI dashboards", tint: "#20A7C9" },

  // Communication
  { name: "FreePBX", category: "Communication", blurb: "VoIP platform", tint: "#66B22E" },
  { name: "Asterisk", category: "Communication", blurb: "Telephony engine", tint: "#E40026" },

  // Engineering
  { name: "QGIS", category: "Engineering", blurb: "GIS platform", tint: "#589632" },
  { name: "Uptime Kuma", category: "Engineering", blurb: "Uptime monitoring", tint: "#5CDD8B" },
];

export const CATEGORY_ORDER: LogoCategory[] = [
  "Infrastructure",
  "Observability",
  "Productivity",
  "DevOps",
  "Media & Home",
  "AI & Agentic",
  "Business",
  "Communication",
  "Engineering",
];
