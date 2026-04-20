import { motion } from "framer-motion";
import { FiCoffee, FiGithub, FiStar } from "react-icons/fi";
import { Section } from "../Section/Section";
import { LINKS } from "../../config/links";
import { useGitHubStars } from "./useGitHubStars";
import styles from "./CTA.module.css";

function formatStars(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function CTA() {
  const stars = useGitHubStars();

  return (
    <Section
      id="cta"
      kicker="Get involved"
      title={<>Be part of this.</>}
      subtitle={
        <>
          We're early. The repo is public. The category is not written yet.
        </>
      }
    >
      <div className={styles.grid}>
        <motion.a
          className={styles.card}
          href={LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className={styles.iconStar} aria-hidden="true">
            <FiGithub />
          </div>
          <h3 className={styles.cardTitle}>Star the repo</h3>
          <p className={styles.cardBody}>
            Help us reach the first 1,000 stars. It's how open-source gets
            found.
          </p>
          <span className={styles.buttonPrimary}>
            <FiStar aria-hidden="true" />
            Star on GitHub
            <span className={styles.count} aria-label={`Current stars: ${formatStars(stars)}`}>
              {formatStars(stars)}
            </span>
          </span>
        </motion.a>

        <motion.a
          className={styles.card}
          href={LINKS.buyMeCoffee}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className={styles.iconCoffee} aria-hidden="true">
            <FiCoffee />
          </div>
          <h3 className={styles.cardTitle}>Buy me a coffee</h3>
          <p className={styles.cardBody}>
            This is built nights and weekends. A coffee keeps the playbook
            alive.
          </p>
          <span className={styles.buttonWarm}>
            <FiCoffee aria-hidden="true" />
            Buy me a coffee
          </span>
        </motion.a>
      </div>

      <nav className={styles.secondary} aria-label="Secondary links">
        {LINKS.docs && <a href={LINKS.docs}>Read the docs</a>}
        {LINKS.twitter && <a href={LINKS.twitter}>Follow on Twitter/X</a>}
        {LINKS.matrix && <a href={LINKS.matrix}>Join the Matrix channel</a>}
        {LINKS.rss && <a href={LINKS.rss}>RSS</a>}
        {!LINKS.docs && !LINKS.twitter && !LINKS.matrix && !LINKS.rss && (
          <span className={styles.muted}>
            Docs · Twitter · Matrix · RSS — coming soon.
          </span>
        )}
      </nav>
    </Section>
  );
}
