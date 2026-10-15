export const SECTIONS = [
  "hero",
  "problem",
  "manifesto",
  "stack",
  "use-cases",
  "engine",
  "anatomy",
  "values",
  "cta",
  "footer",
] as const;

export type SectionId = (typeof SECTIONS)[number];
