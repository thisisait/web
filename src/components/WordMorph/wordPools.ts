import type { SectionId } from "../../types/sections";

export type Triplet = { A: string; I: string; T: string };

export const HERO_POOL: Triplet[] = [
  { A: "Agentic", I: "Infrastructure", T: "Technology" },
  { A: "Automated", I: "Information", T: "Takeover" },
  { A: "Autonomous", I: "Integrated", T: "Transparency" },
  { A: "All-in-one", I: "Intelligent", T: "Transformation" },
  { A: "Apple-native", I: "Independent", T: "Turnkey" },
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
