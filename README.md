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
