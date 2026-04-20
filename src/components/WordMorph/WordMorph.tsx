import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import styles from "./WordMorph.module.css";
import { HERO_POOL, type Triplet } from "./wordPools";

type Letter = "A" | "I" | "T";
const LETTERS: Letter[] = ["A", "I", "T"];

export interface WordMorphProps {
  mode: "hero" | "header";
  /** Header mode: the current section's triplet. Hero mode: ignored (uses pool). */
  words?: Triplet | null;
  size: "xxl" | "md" | "sm";
}

const springConfig = { type: "spring" as const, stiffness: 180, damping: 16, mass: 0.8 };

/** Pick a random index different from the previous. */
function pickNext(prev: number, len: number): number {
  if (len <= 1) return 0;
  let n = Math.floor(Math.random() * (len - 1));
  if (n >= prev) n += 1;
  return n;
}

export function WordMorph({ mode, words, size }: WordMorphProps) {
  const reduced = useReducedMotion();
  const [tripletIdx, setTripletIdx] = useState(0);
  const [expanded, setExpanded] = useState<Letter | null>(null);

  // Shared cycle: pause → A → collapse → I → collapse → T → collapse → …
  // Hero rotates HERO_POOL at the end of each cycle. Header uses SECTION_WORDS
  // via the `words` prop and restarts when that prop changes.
  const wordsKey = mode === "header" ? `${words?.A}|${words?.I}|${words?.T}` : "hero";

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    // Header cycles faster than hero — it is smaller and always visible.
    const startDelay = mode === "header" ? 300 : 800;
    const expandFor = mode === "header" ? 1800 : 1400;
    const gap = mode === "header" ? 350 : 500;

    const runCycle = () => {
      setExpanded(null);
      schedule(() => setExpanded("A"), startDelay);
      schedule(() => setExpanded(null), startDelay + expandFor);
      schedule(() => setExpanded("I"), startDelay + expandFor + gap);
      schedule(() => setExpanded(null), startDelay + expandFor * 2 + gap);
      schedule(() => setExpanded("T"), startDelay + expandFor * 2 + gap * 2);
      schedule(() => setExpanded(null), startDelay + expandFor * 3 + gap * 2);
      schedule(() => {
        if (mode === "hero") {
          setTripletIdx((prev) => pickNext(prev, HERO_POOL.length));
        }
        runCycle();
      }, startDelay + expandFor * 3 + gap * 3);
    };

    runCycle();
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [mode, reduced, wordsKey]);

  const triplet: Triplet = useMemo(() => {
    if (mode === "header") {
      return words ?? HERO_POOL[0];
    }
    return HERO_POOL[tripletIdx];
  }, [mode, words, tripletIdx]);

  // Reduced-motion hero fallback: slow triplet rotation, no expansion.
  useEffect(() => {
    if (mode !== "hero" || !reduced) return;
    const id = window.setInterval(() => {
      setTripletIdx((prev) => pickNext(prev, HERO_POOL.length));
    }, 6000);
    return () => window.clearInterval(id);
  }, [mode, reduced]);

  const sizeClass =
    size === "xxl" ? styles.xxl : size === "md" ? styles.md : styles.sm;

  const srText = `This is AIT — ${triplet.A} ${triplet.I} ${triplet.T}`;

  return (
    <div
      className={[styles.wordmark, sizeClass, styles[`mode_${mode}`]].join(" ")}
    >
      <span className="sr-only">{srText}</span>
      <span aria-hidden="true" className={styles.glyphs}>
        {LETTERS.map((letter) => (
          <LetterSlot
            key={letter}
            letter={letter}
            word={triplet[letter]}
            expanded={expanded === letter}
            reduced={reduced}
          />
        ))}
      </span>
    </div>
  );
}

interface LetterSlotProps {
  letter: Letter;
  word: string;
  expanded: boolean;
  reduced: boolean;
}

function LetterSlot({ letter, word, expanded, reduced }: LetterSlotProps) {
  const rest = word.slice(1);

  return (
    <motion.span
      layout={!reduced}
      transition={reduced ? { duration: 0 } : springConfig}
      className={styles.slot}
      data-letter={letter}
    >
      <span className={styles.anchor}>{letter}</span>
      <AnimatePresence initial={false} mode="wait">
        {expanded && (
          <motion.span
            key={word}
            className={styles.rest}
            initial={reduced ? { opacity: 0 } : { width: 0, opacity: 0 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { width: "auto", opacity: 1, transition: springConfig }
            }
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0.1 } }
                : {
                    width: 0,
                    opacity: 0,
                    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                  }
            }
          >
            {rest.split("").map((ch, i) => (
              <motion.span
                key={i}
                className={styles.char}
                initial={reduced ? {} : { opacity: 0, y: 8 }}
                animate={
                  reduced
                    ? {}
                    : {
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: 0.15 + i * 0.025,
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                }
                exit={reduced ? {} : { opacity: 0, transition: { duration: 0.15 } }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
