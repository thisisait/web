import type { SectionId } from "../../types/sections";

export type Triplet = { A: string; I: string; T: string };

// Every triplet below is curated so that
//   (a) each individual word is a plausible expansion of A / I / T, and
//   (b) the three words, read together, form a coherent phrase.
// Keep this invariant when adding new triplets — the hero cycles through
// them one letter at a time, but the header shows all three at once.
export const HERO_POOL: Triplet[] = [
  { A: "Agentic", I: "Infrastructure", T: "Technology" },
  { A: "Autonomous", I: "Integrated", T: "Toolchain" },
  { A: "Apple-native", I: "Infrastructure", T: "Tooling" },
  { A: "All-in-one", I: "Independent", T: "Technology" },
  { A: "Automated", I: "Intelligent", T: "Transformation" },
  { A: "Authentic", I: "Indie", T: "Tech" },
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
