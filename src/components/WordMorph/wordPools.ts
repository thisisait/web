import type { SectionId } from "../../types/sections";

export type Triplet = { A: string; I: string; T: string };

// Invariants for this pool:
//   1. No word is reused — 15 unique fillers across 5 triplets.
//   2. Each word, standalone, is a plausible expansion of A / I / T.
//   3. Each triplet, read together, forms a coherent phrase.
// Adding a new triplet means picking three new words that don't appear elsewhere.
export const HERO_POOL: Triplet[] = [
  { A: "Agentic", I: "Infrastructure", T: "Technology" },
  { A: "Autonomous", I: "Integrated", T: "Toolchain" },
  { A: "Automated", I: "Intelligent", T: "Transformation" },
  { A: "Apple-native", I: "Independent", T: "Tooling" },
  { A: "Authentic", I: "Indie", T: "Takeover" },
];

export const SECTION_WORDS: Record<SectionId, Triplet> = {
  hero: { A: "Agentic", I: "Infrastructure", T: "Technology" },
  problem: { A: "Addictive", I: "Invoices", T: "Tax" },
  manifesto: { A: "Autonomous", I: "Independent", T: "Takeover" },
  stack: { A: "All-in-one", I: "Integrated", T: "Turnkey" },
  "use-cases": { A: "Affordable", I: "Immune", T: "Thrifty" },
  engine: { A: "Automated", I: "Infrastructure", T: "Transparent" },
  values: { A: "Authentic", I: "Indie", T: "Trusted" },
  cta: { A: "Actionable", I: "Immediate", T: "Today" },
  footer: { A: "Agentic", I: "Infrastructure", T: "Technology" },
};
