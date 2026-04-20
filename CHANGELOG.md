# Changelog

## 0.1.0 — 2026-04-20

Initial release of the **This is AIT** manifesto site.

- Single-page React + Vite + TypeScript site, GitHub Pages deploy
- Animated hero word-morph (A / I / T expanding to rotating word pool)
- Section-aware sticky header that re-maps A / I / T per section via
  `IntersectionObserver`
- Problem / Manifesto / Stack / UseCases / Engine / Values / CTA / Footer
  sections
- FOSS logo showcase grouped by category with marquee ticker and monogram
  placeholders for 40+ projects
- Animated SaaS-replacement table with scroll-triggered savings counter
- nOS engine section with styled terminal block and feature grid
- GitHub star count fetched once per session with sessionStorage caching
- Light + dark theme, `prefers-color-scheme` default, localStorage persistence
- Full `prefers-reduced-motion` fallback path
- GitHub Actions workflow deploying `dist/` to GitHub Pages
