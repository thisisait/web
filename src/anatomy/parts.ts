/* The atlas catalogue. Every labelled part maps to exactly one word of the nOS
   lexicon (state/genome/lexicon.yml in thisisait/nOS) or one organ system of the
   signed apex ruling. `lex` quotes the source verbatim (English, the genome's
   language); the localized gloss lives in i18n. Parts marked `vision` draw the
   organism as it is becoming, not only as it runs today. */

export type LayerId =
  | "bell"
  | "systems"
  | "host"
  | "canals"
  | "nerves"
  | "wiring"
  | "limbs"
  | "symbionts"
  | "cells"
  | "genome"
  | "habitat"
  | "vision";

export type Source = "lexicon" | "apex" | "doctrine" | "vision";

export interface LexEntry {
  /** level in the body plan, or "proper name" */
  level: string;
  means: string;
  not?: string;
  counter?: string;
  mechanism?: string;
}

export interface Part {
  id: string;
  layer: LayerId;
  source: Source;
  /** lexicon word or apex key the entry quotes */
  key: string;
  lex: LexEntry;
  /** apex ruling: title + tells (verbatim, signed) */
  apex?: { title: string; tells: string };
}

export const LAYERS: { id: LayerId; swatch: string }[] = [
  { id: "bell", swatch: "#d9b8a8" },
  { id: "systems", swatch: "#c98f7c" },
  { id: "host", swatch: "#b9918c" },
  { id: "canals", swatch: "#2a63a8" },
  { id: "nerves", swatch: "#e0a145" },
  { id: "wiring", swatch: "#efe6d6" },
  { id: "limbs", swatch: "#a77c6c" },
  { id: "symbionts", swatch: "#3f8f86" },
  { id: "cells", swatch: "#6a8cd3" },
  { id: "genome", swatch: "#b48ad8" },
  { id: "habitat", swatch: "#4f6b8a" },
  { id: "vision", swatch: "#d48a6c" },
];

const apex = (
  id: string,
  title: string,
  tells: string,
  layer: LayerId = "systems",
): Part => ({
  id,
  layer,
  source: "apex",
  key: id,
  apex: { title, tells },
  lex: {
    level: "organ system",
    means:
      "A public group of organs serving one function; the apex page shows thirteen. Its source is the apex ruling's `organ_systems:` key.",
    not: "organ, organism",
    counter: "a compose stack such as iiab (a deployment group, not a public function)",
  },
});

export const PARTS: Part[] = [
  {
    id: "organism", layer: "bell", source: "lexicon", key: "organism",
    lex: { level: "organism", means: "One nOS install on one machine, all its organ systems together.", not: "habitat, anatomy", counter: "the anatomy graph (a drawing of the organism, not the organism)" },
  },
  {
    id: "converge", layer: "bell", source: "lexicon", key: "converge",
    lex: { level: "procedure", means: "One playbook run that moves the source into the running system.", not: "nervous system", mechanism: "a reconcile loop (a Kubernetes operator) — declared against observed; it does not heal", counter: "a hand `docker compose up` (it moves one container, not the declared source)" },
  },
  { id: "cortex", layer: "host", source: "lexicon", key: "Cortex", lex: { level: "proper name", means: "The reasoning machinery (the cortex daemon, cortex-lang and Wing's executor); it is not KEAP.", not: "memory, KEAP" } },
  { id: "thalamus", layer: "host", source: "lexicon", key: "Thalamus", lex: { level: "proper name", means: "The Rust organ that relays each turn of a conversation to the organ that answers it and to Cortex. Cells act in it, and their organelles move into it from Wing's AgentKit one function at a time.", not: "Cortex, Wing, organelles" } },
  { id: "hippocampus", layer: "host", source: "lexicon", key: "Hippocampus", lex: { level: "proper name", means: "KEAP's door where an agent's memory is formed; it serves the CortexDB wire under /hippocampus and writes engrams.", not: "Cortex, KEAP" } },
  { id: "pupil", layer: "host", source: "lexicon", key: "Pupil", lex: { level: "proper name", means: "Iris's desktop window: a Tauri app that opens the Thalamus socket as the logged-in user and draws the same closed component vocabulary as the terminal shell. It holds no secret and opens no port.", not: "Face, Thalamus" } },
  { id: "ears", layer: "host", source: "lexicon", key: "Ears", lex: { level: "proper name", means: "The speech organ, which hears and speaks." } },
  { id: "pulse", layer: "host", source: "lexicon", key: "Pulse", lex: { level: "proper name", means: "The scheduler that runs every scheduled job.", not: "heartbeat" } },
  { id: "bone", layer: "host", source: "lexicon", key: "Bone", lex: { level: "proper name", means: "The host API bridge between the runs and the records." } },
  { id: "wing", layer: "host", source: "lexicon", key: "Wing", lex: { level: "proper name", means: "The host dashboard and audit ledger." } },
  { id: "receptor", layer: "vision", source: "lexicon", key: "Receptor", lex: { level: "proper name", means: "The host daemon that lets a host login reach KEAP's human door as a person: the kernel names the login, ~/.nos/identity-map.yml names the person, and the receptor sends KEAP that person's headers and the proxy secret.", not: "Thalamus, Hippocampus" } },

  apex("gatehouse", "The Gatehouse", "Access is decided in one place."),
  apex("spine", "The Spine", "The estate governs and audits itself."),
  apex("stores", "The Stores", "Everything remembered lives here, at home."),
  apex("vault", "The Vault", "Secrets are kept, never scattered."),
  apex("keel", "The Keel", "Copied nightly. Restore, proven."),
  apex("archive", "The Archive", "Where knowledge is preserved and grown."),
  apex("forge", "The Forge", "Software made, tested and landed at home."),
  apex("backoffice", "The Backoffice", "CRM, books and a customer desk, at home."),
  apex("commons", "The Commons", "Daily work and daily life, shared."),
  apex("watch", "The Watch", "The estate keeps watch on itself."),
  apex("wits", "The Wits", "Autonomous minds with bounded hands."),
  apex("clockwork", "The Clockwork", "Duties kept on a clock, events turned into actions."),
  apex("voice", "The Voice", "Mail, calls and signals, spoken from home."),

  { id: "veins", layer: "canals", source: "lexicon", key: "vein", lex: { level: "organ system", means: "An anonymised edge between two organ systems on the public apex page; the public key `veins` is frozen with the page's schema.", not: "atom, an anatomy-graph edge", counter: "the Bone↔face link (an edge between two organs; it never leaves the machine)" } },
  { id: "nerves", layer: "nerves", source: "lexicon", key: "nervous system", lex: { level: "across levels", means: "The path events take to the operator, from events to the Wing inbox to ntfy or mail.", not: "converge", counter: "a converge (one playbook run, not the path events take)" } },
  { id: "reflex", layer: "nerves", source: "lexicon", key: "reflex", lex: { level: "across levels", means: "An automatic, scheduled response of an organ; Pulse runs each one on its clock.", not: "Pulse, heartbeat, organ", mechanism: "a scheduled job (cron); where it restarts what failed, a supervisor (Erlang/OTP)", counter: "a launchd daemon (an organ, not a scheduled response)" } },
  { id: "wiring", layer: "wiring", source: "lexicon", key: "plugin", lex: { level: "across levels", means: "A plugin.yml declaring how one service is wired to the others (SSO, dashboards, jobs).", not: "tissue, gene", counter: "an apps/<name>.yml manifest app (it deploys a service; a plugin only wires one)" } },
  { id: "limbs", layer: "limbs", source: "lexicon", key: "limb", lex: { level: "across levels", means: "A tool that acts.", not: "sense, side", mechanism: "port / adapter (hexagonal architecture)", counter: "tools/red-status.py, or an agent tool grant whose every scope is .read (each only reads: a sense)" } },
  { id: "senses", layer: "nerves", source: "lexicon", key: "sense", lex: { level: "across levels", means: "A reader or judge that only reads; an immune indicator is a sense with an indicator contract.", not: "cell, limb", counter: "tools/genome-codegen.py (it writes the glossary; only its --check reads)" } },
  { id: "symbionts", layer: "symbionts", source: "lexicon", key: "symbiont", lex: { level: "origin", means: "Declared foreign software that lives beside nOS and is updated by its own vendor.", not: "self, habitat", counter: "a personal Homebrew package (habitat: the machine owner's; nOS installs it only through an opt-in toggle the owner sets)" } },
  { id: "cells", layer: "cells", source: "lexicon", key: "cell", lex: { level: "cell", means: "One model in one specialization; in code it is called an agent.", not: "sense, stem cell", counter: "an immune indicator (a sense)" } },
  { id: "genome", layer: "genome", source: "lexicon", key: "genome", lex: { level: "genome", means: "The declared facts every part of nOS inherits. Most live in state/genome/ (genes, schemas, this lexicon, the task types); the skill library lives in files/anatomy/skills/, beside the code that hands skills out.", not: "law, definition", counter: "a cell's system.md (its definition, not something every part inherits)" } },
  { id: "heartbeat", layer: "habitat", source: "lexicon", key: "heartbeat", lex: { level: "across levels", means: "A periodic signal that proves something is still alive.", not: "Pulse", mechanism: "a liveness signal; monitor / link (Erlang/OTP)", counter: "a health check (asked from outside; a heartbeat is sent from inside on a clock)" } },
  { id: "habitat", layer: "habitat", source: "lexicon", key: "habitat", lex: { level: "habitat", means: "The machine and what lives beside the organism: its software by origin (self / symbiont / habitat). Software of origin habitat belongs to the machine's owner; nOS never installs or touches it by default, only through opt-in toggles the owner sets.", not: "organism, symbiont", counter: "the Gitea or GitLab nOS hosts (organ jobs, not habitat)" } },

  { id: "immune", layer: "vision", source: "doctrine", key: "immune-system.md", lex: { level: "doctrine", means: "The immune system reports; it does not attack. An immune indicator is a sense with an indicator contract: declared is tolerated, undeclared is reported." } },
  { id: "tissue", layer: "vision", source: "lexicon", key: "tissue", lex: { level: "tissue", means: "The transplantable pack of one specialization: its cells, skills, tables, services and reflexes.", not: "plugin, organ" } },
  { id: "engram", layer: "vision", source: "lexicon", key: "engram", lex: { level: "across levels", means: "One memory event of an agent, a row of the engram DataTable that the Hippocampus writes.", not: "verdicts" } },
  { id: "twin", layer: "vision", source: "lexicon", key: "twin", lex: { level: "across levels", means: "The second Mac; two lists that must stay equal are in mirror-parity." } },
];

export const PART_IDS = PARTS.map((p) => p.id);
export type PartId = (typeof PART_IDS)[number];
export const partById = (id: string): Part => PARTS.find((p) => p.id === id)!;
