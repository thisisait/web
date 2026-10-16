export const SECTIONS = [
  "hero",
  "problem",
  "manifesto",
  "stack",
  "use-cases",
  "engine",
  "values",
  "cta",
  "footer",
] as const;

export type SectionId = (typeof SECTIONS)[number];
