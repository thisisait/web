import { Fragment } from "react";
import { motion } from "framer-motion";
import { Section } from "../Section/Section";
import { useI18n } from "../../i18n";
import styles from "./Manifesto.module.css";

/** Replaces %STRONG_START% / %STRONG_END% with a real <strong> element while
 *  keeping the surrounding text as plain string segments. Keeps locale files
 *  free of JSX. */
function renderWithStrong(text: string): React.ReactNode {
  const parts = text.split(/%STRONG_START%|%STRONG_END%/);
  return parts.map((part, i) =>
    // Odd indices are inside the strong marker (split returns before/inside/after).
    i % 2 === 1 ? (
      <strong key={i}>{part}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function Manifesto() {
  const { t } = useI18n();
  const entries = t.manifesto.timeline;

  return (
    <Section
      id="manifesto"
      band="soft"
      kicker={t.manifesto.kicker}
      title={t.manifesto.title}
    >
      <div className={styles.grid}>
        <div className={styles.prose}>
          {t.manifesto.paragraphs.map((p, i) => (
            <p key={i}>{renderWithStrong(p)}</p>
          ))}
          <p className={styles.closing}>{t.manifesto.closing}</p>
        </div>
        <ol className={styles.timeline}>
          {entries.map((entry, idx) => (
            <motion.li
              key={entry.era}
              className={[
                styles.entry,
                idx === entries.length - 1 ? styles.highlight : "",
              ].join(" ")}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className={styles.era}>{entry.era}</span>
              <span className={styles.label}>{entry.label}</span>
              <span className={styles.note}>{entry.note}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
