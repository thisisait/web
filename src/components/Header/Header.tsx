import { motion } from "framer-motion";
import { FiGithub, FiMoon, FiSun } from "react-icons/fi";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useTheme } from "../../hooks/useTheme";
import { useI18n } from "../../i18n";
import { LINKS } from "../../config/links";
import { WordMorph } from "../WordMorph/WordMorph";
import { SECTION_WORDS } from "../WordMorph/wordPools";
import { useScrolled } from "./useScrolled";
import styles from "./Header.module.css";

export function Header() {
  const active = useActiveSection();
  const scrolled = useScrolled(0.6);
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const words = SECTION_WORDS[active];

  return (
    <motion.header
      className={[styles.header, scrolled ? styles.scrolled : ""].join(" ")}
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: scrolled ? 0 : -12, opacity: scrolled ? 1 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!scrolled}
    >
      <div className={[styles.inner, "container"].join(" ")}>
        <a href="#hero" className={styles.brand} aria-label={t.header.homeAria}>
          <WordMorph mode="header" words={words} size="md" />
        </a>

        <nav className={styles.nav} aria-label="Section navigation">
          <a href="#manifesto">{t.header.nav.manifesto}</a>
          <a href="#stack">{t.header.nav.stack}</a>
          <a href="#use-cases">{t.header.nav.useCases}</a>
          <a href="#engine">{t.header.nav.engine}</a>
          <a href="#cta">{t.header.nav.getInvolved}</a>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggle}
            aria-label={
              theme === "dark"
                ? t.header.themeSwitchToLight
                : t.header.themeSwitchToDark
            }
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <a
            className={styles.starBtn}
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiGithub aria-hidden="true" />
            <span>{t.header.star}</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}
