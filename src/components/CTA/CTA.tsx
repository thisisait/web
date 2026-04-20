import { motion } from "framer-motion";
import { FiCoffee, FiGithub, FiStar } from "react-icons/fi";
import { Section } from "../Section/Section";
import { LINKS } from "../../config/links";
import { useI18n } from "../../i18n";
import { useGitHubStars } from "./useGitHubStars";
import styles from "./CTA.module.css";

function formatStars(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function CTA() {
  const stars = useGitHubStars();
  const { t } = useI18n();
  const starsLabel = formatStars(stars);

  return (
    <Section
      id="cta"
      kicker={t.cta.kicker}
      title={t.cta.title}
      subtitle={t.cta.subtitle}
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
          <h3 className={styles.cardTitle}>{t.cta.star.title}</h3>
          <p className={styles.cardBody}>{t.cta.star.body}</p>
          <span className={styles.buttonPrimary}>
            <FiStar aria-hidden="true" />
            {t.cta.star.button}
            <span className={styles.count} aria-label={t.cta.star.starsAria(starsLabel)}>
              {starsLabel}
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
          <h3 className={styles.cardTitle}>{t.cta.coffee.title}</h3>
          <p className={styles.cardBody}>{t.cta.coffee.body}</p>
          <span className={styles.buttonWarm}>
            <FiCoffee aria-hidden="true" />
            {t.cta.coffee.button}
          </span>
        </motion.a>
      </div>

      <nav className={styles.secondary} aria-label={t.cta.secondaryAria}>
        {LINKS.docs && <a href={LINKS.docs}>{t.cta.readDocs}</a>}
        {LINKS.twitter && <a href={LINKS.twitter}>{t.cta.followTwitter}</a>}
        {LINKS.matrix && <a href={LINKS.matrix}>{t.cta.joinMatrix}</a>}
        {LINKS.rss && <a href={LINKS.rss}>{t.cta.rss}</a>}
        {!LINKS.docs && !LINKS.twitter && !LINKS.matrix && !LINKS.rss && (
          <span className={styles.muted}>{t.cta.secondaryMuted}</span>
        )}
      </nav>
    </Section>
  );
}
