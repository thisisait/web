import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Post-build: duplicate dist/index.html into /cs, /de, /fr so that
// `thisisait.eu/cs/` returns a real 200 (same SPA JS, which reads the path
// and sets the locale). Asset references stay absolute so a subpath works.
const PREFIXED_LOCALES = ["cs", "de", "fr"] as const;

function copyLocales(): Plugin {
  return {
    name: "ait-copy-locales",
    apply: "build",
    closeBundle() {
      const dist = path.resolve("dist");
      const source = path.join(dist, "index.html");
      if (!fs.existsSync(source)) return;
      for (const locale of PREFIXED_LOCALES) {
        const dir = path.join(dist, locale);
        fs.mkdirSync(dir, { recursive: true });
        fs.copyFileSync(source, path.join(dir, "index.html"));
      }
    },
  };
}

// Deployed on a custom domain (thisisait.eu) so base stays at "/".
// If you ever deploy to username.github.io/repo/, set base to "/repo/".
export default defineConfig({
  plugins: [react(), copyLocales()],
  base: "/",
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
