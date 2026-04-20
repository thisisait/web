import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Keep these in sync with src/i18n/*.ts — duplicated here because
// vite.config.ts runs in Node before the TS app bundle is aware of anything.
interface LocaleSeo {
  code: string;
  title: string;
  description: string;
  canonical: string;
}

const SITE = "https://thisisait.eu";

const LOCALE_SEO: LocaleSeo[] = [
  {
    code: "en",
    title: "This is AIT · Agentic IT — self-hosted, open source",
    description:
      "A new category of infrastructure — self-hosted, agentic, open source. One stack. Forty services. Zero SaaS bills.",
    canonical: `${SITE}/`,
  },
  {
    code: "cs",
    title: "This is AIT · Agentic IT — self-hosted, open source",
    description:
      "Nová kategorie infrastruktury — self-hosted, agentní, open source. Jeden stack, čtyřicet služeb, nula SaaS předplatných.",
    canonical: `${SITE}/cs/`,
  },
  {
    code: "de",
    title: "This is AIT · Agentic IT — selbstgehostet, Open Source",
    description:
      "Eine neue Kategorie Infrastruktur — selbstgehostet, agentisch, Open Source. Ein Stack, vierzig Dienste, null SaaS-Rechnungen.",
    canonical: `${SITE}/de/`,
  },
  {
    code: "fr",
    title: "This is AIT · Agentic IT — auto-hébergée, open source",
    description:
      "Une nouvelle catégorie d'infrastructure — auto-hébergée, agentique, open source. Un stack, quarante services, zéro SaaS.",
    canonical: `${SITE}/fr/`,
  },
];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyLocaleSeo(html: string, seo: LocaleSeo): string {
  const title = escapeHtml(seo.title);
  const desc = escapeHtml(seo.description);
  return html
    .replace(/<html\s+lang="[^"]*"/, `<html lang="${seo.code}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${desc}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${desc}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${seo.canonical}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${desc}" />`,
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${seo.canonical}" />`,
    );
}

// Post-build: duplicate dist/index.html into /cs, /de, /fr with locale-
// specific title / description / lang / canonical so search-engine crawlers
// see the right metadata even before JS runs.
function localeHtmlPlugin(): Plugin {
  return {
    name: "ait-locale-html",
    apply: "build",
    closeBundle() {
      const dist = path.resolve("dist");
      const source = path.join(dist, "index.html");
      if (!fs.existsSync(source)) return;
      const raw = fs.readFileSync(source, "utf8");
      for (const seo of LOCALE_SEO) {
        const out = applyLocaleSeo(raw, seo);
        if (seo.code === "en") {
          fs.writeFileSync(source, out);
        } else {
          const dir = path.join(dist, seo.code);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), out);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), localeHtmlPlugin()],
  base: "/",
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
