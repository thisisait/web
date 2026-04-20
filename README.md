# thisisait.eu

Manifesto and launch page for **This is AIT** — Agentic IT, the self-hosted successor to the cloud era.

Single-page site built with **React 18 + Vite + TypeScript**, deployed to GitHub Pages.

---

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build
pnpm preview      # preview the production build
```

Node 18+ and pnpm 9 are recommended. npm/yarn also work.

---

## Configuration

### Links

All outbound URLs live in a single file — update them there before launch.

`src/config/links.ts`:

```ts
export const LINKS = {
  github: "https://github.com/thisisait/nOS",
  buyMeCoffee: "https://www.buymeacoffee.com/PLACEHOLDER",
  twitter: "",
  matrix: "",
  docs: "",
  rss: "",
};

export const GITHUB_REPO = "thisisait/nOS"; // used for the star count fetch
```

### Custom domain

`public/CNAME` contains the deploy target (`thisisait.eu`). Update it if you point the repo to a different domain.

---

## Adding a FOSS logo

1. Drop the SVG into `src/assets/logos/`.
2. Register it in `src/components/Stack/logos.ts`:

```ts
{ name: "Jellyfin", category: "Media & Home", blurb: "Media server", tint: "#00A4DC", svg: "/src/assets/logos/jellyfin.svg" }
```

Until `svg` is set, the tile renders a monogram placeholder using the project's initials and tint.

---

## Editing section copy

Each section lives under `src/components/<Section>/`. Copy is inline in the `.tsx` file — no CMS. Keep sentences short.

Per-section word morphs are defined in `src/components/WordMorph/wordPools.ts`.

---

## Translations

Locale bundles live in `src/i18n/`:

- `en.ts`, `cs.ts`, `de.ts`, `fr.ts` — one file per language, all must implement `Messages`.
- `index.tsx` — `I18nProvider`, `useI18n`, URL routing.
- `types.ts` — the `Messages` interface (source of truth).

**Routing:** `/` serves EN. `/cs/`, `/de/`, `/fr/` serve the other locales. The locale switcher in the footer calls `history.pushState`, preserving the hash (`/cs/#cta` works). A Vite plugin copies `dist/index.html` into each locale subdirectory at build with locale-specific `<title>`, `<meta description>`, `<html lang>`, and `<link rel="canonical">`.

**Adding a locale:** create `src/i18n/xy.ts` implementing `Messages`, register it in `DICTIONARIES` in `index.tsx`, add `"xy"` to `LOCALES` in `types.ts`, add it to the `LOCALE_SEO` array in `vite.config.ts` and to `public/sitemap.xml`.

---

## SEO & indexing

**Built-in:**

- `<title>` + `<meta description>` per locale (both build-time and runtime)
- Canonical + `hreflang` alternates per locale
- `sitemap.xml` referenced from `robots.txt`
- JSON-LD: `Organization` + `WebSite` schemas
- Open Graph + Twitter card meta (updated on locale change)
- Semantic HTML, `<html lang>` attribute, sr-only wordmark text

**Automated on every deploy:**

- [IndexNow](https://www.indexnow.org/) ping — notifies Bing, Seznam.cz, Yandex, and Naver when the site changes. Key lives in `public/<key>.txt`; workflow step `indexnow` in `.github/workflows/deploy.yml` POSTs the URL list after a successful Pages deploy. Google does **not** participate in IndexNow.

**Manual one-time setup (owner actions):**

1. **Google Search Console** — add `thisisait.eu` as a Domain property, verify via DNS TXT record (DNS provider → add TXT at apex), then submit `https://thisisait.eu/sitemap.xml`. Google crawls automatically after that; there is no public indexing API for regular pages.
2. **Bing Webmaster Tools** — add site, import from GSC or verify separately. IndexNow already pings Bing, but the Console gives visibility.
3. **Seznam.cz Webmaster** ([search.seznam.cz/pridat-stranku](https://search.seznam.cz/pridat-stranku)) — submit the site once. Picked up via IndexNow afterwards.
4. **Plausible / Umami / GA4** — optional, add a single `<script>` inside the analytics slot in `index.html`.

**What you cannot automate:**

- Google indexing speed. New domains typically take 2–6 weeks to appear in SERPs even with perfect technical SEO.
- Google's `/ping?sitemap=...` endpoint was deprecated in June 2023 and no longer works.
- Google's Indexing API only accepts `JobPosting` and `BroadcastEvent` schemas, not marketing pages.

---

## Deploy

`main` is auto-deployed to GitHub Pages by `.github/workflows/deploy.yml`.

For a custom domain (thisisait.eu), keep `vite.config.ts`'s `base: "/"`. For a project subpath (`username.github.io/repo/`), set `base: "/repo/"`.

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Type-check + production bundle to `dist/` |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm typecheck` | TypeScript-only check |

---

## Dependency budget

`react`, `react-dom`, `framer-motion`, `react-icons`. Anything new must carry a one-line justification in a code comment.

---

## License

MIT. Made on an M4 Pro.
