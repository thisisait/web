// Registry of FOSS projects shown in the Stack section.
// `slug` matches a simple-icons slug (see brandIcons.ts). When missing,
// LogoTile renders a monogram fallback using the project's initials + tint.

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
  /** simple-icons slug; if missing, LogoTile draws a monogram. */
  slug?: string;
  /** Brand accent color for the icon / monogram. */
  tint?: string;
}

export const LOGOS: Logo[] = [
  // Infrastructure
  { name: "Docker", category: "Infrastructure", blurb: "Container runtime", slug: "docker", tint: "#2496ED" },
  { name: "MariaDB", category: "Infrastructure", blurb: "SQL database", slug: "mariadb", tint: "#003545" },
  { name: "PostgreSQL", category: "Infrastructure", blurb: "SQL database", slug: "postgresql", tint: "#336791" },
  { name: "Redis", category: "Infrastructure", blurb: "In-memory store", slug: "redis", tint: "#DC382D" },
  { name: "Traefik", category: "Infrastructure", blurb: "Edge router", slug: "traefikproxy", tint: "#24A1C1" },
  { name: "Portainer", category: "Infrastructure", blurb: "Container UI", slug: "portainer", tint: "#13BEF9" },
  { name: "Authentik", category: "Infrastructure", blurb: "SSO & identity", slug: "authentik", tint: "#FD4B2D" },
  { name: "Infisical", category: "Infrastructure", blurb: "Secrets vault", tint: "#6843EC" },
  { name: "Ansible", category: "Infrastructure", blurb: "Orchestration", slug: "ansible", tint: "#EE0000" },
  { name: "Bluesky PDS", category: "Infrastructure", blurb: "Personal data server", slug: "bluesky", tint: "#0085FF" },

  // Observability
  { name: "Grafana", category: "Observability", blurb: "Dashboards", slug: "grafana", tint: "#F46800" },
  { name: "Prometheus", category: "Observability", blurb: "Metrics", slug: "prometheus", tint: "#E6522C" },
  { name: "Loki", category: "Observability", blurb: "Logs", tint: "#F5A623" },
  { name: "Tempo", category: "Observability", blurb: "Traces", tint: "#F16528" },
  { name: "Alloy", category: "Observability", blurb: "Telemetry agent", tint: "#F16528" },

  // Productivity
  { name: "Nextcloud", category: "Productivity", blurb: "Files & collaboration", slug: "nextcloud", tint: "#0082C9" },
  { name: "Outline", category: "Productivity", blurb: "Team wiki", slug: "outline", tint: "#0366D6" },
  { name: "WordPress", category: "Productivity", blurb: "Publishing", slug: "wordpress", tint: "#21759B" },
  { name: "Vaultwarden", category: "Productivity", blurb: "Password manager", slug: "vaultwarden", tint: "#175DDC" },
  { name: "n8n", category: "Productivity", blurb: "Workflow automation", slug: "n8n", tint: "#EA4B71" },
  { name: "Paperless-ngx", category: "Productivity", blurb: "Document archive", slug: "paperlessngx", tint: "#17541F" },

  // DevOps
  { name: "Gitea", category: "DevOps", blurb: "Git hosting", slug: "gitea", tint: "#609926" },
  { name: "GitLab", category: "DevOps", blurb: "Full DevOps platform", slug: "gitlab", tint: "#FC6D26" },
  { name: "Woodpecker CI", category: "DevOps", blurb: "Continuous integration", tint: "#4CAF50" },

  // Media & Home
  { name: "Jellyfin", category: "Media & Home", blurb: "Media server", slug: "jellyfin", tint: "#00A4DC" },
  { name: "Kiwix", category: "Media & Home", blurb: "Offline knowledge", slug: "kiwix", tint: "#1A1A2E" },
  { name: "Calibre-Web", category: "Media & Home", blurb: "E-book library", slug: "calibreweb", tint: "#45573E" },
  { name: "Home Assistant", category: "Media & Home", blurb: "Home automation", slug: "homeassistant", tint: "#18BCF2" },
  { name: "RustFS", category: "Media & Home", blurb: "Object storage", slug: "rustfs", tint: "#DEA584" },
  { name: "Puter", category: "Media & Home", blurb: "Desktop in the browser", tint: "#363636" },

  // AI & Agentic
  { name: "Ollama", category: "AI & Agentic", blurb: "Local LLM runtime", slug: "ollama", tint: "#000000" },
  { name: "Open WebUI", category: "AI & Agentic", blurb: "Chat frontend", tint: "#6C63FF" },
  { name: "OpenClaw", category: "AI & Agentic", blurb: "Agentic operator (custom)", tint: "#E85A4F" },

  // Business
  { name: "ERPNext", category: "Business", blurb: "ERP / CRM", slug: "erpnext", tint: "#0089FF" },
  { name: "FreeScout", category: "Business", blurb: "Help desk", tint: "#005EBB" },
  { name: "Metabase", category: "Business", blurb: "Analytics", slug: "metabase", tint: "#509EE3" },
  { name: "Apache Superset", category: "Business", blurb: "BI dashboards", slug: "apachesuperset", tint: "#20A7C9" },

  // Communication
  { name: "FreePBX", category: "Communication", blurb: "VoIP platform", tint: "#66B22E" },
  { name: "Asterisk", category: "Communication", blurb: "Telephony engine", slug: "asterisk", tint: "#E40026" },

  // Engineering
  { name: "QGIS", category: "Engineering", blurb: "GIS platform", slug: "qgis", tint: "#589632" },
  { name: "Uptime Kuma", category: "Engineering", blurb: "Uptime monitoring", slug: "uptimekuma", tint: "#5CDD8B" },
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
