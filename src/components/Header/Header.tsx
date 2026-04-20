import { motion } from "framer-motion";
import { FiGithub, FiMoon, FiSun } from "react-icons/fi";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useTheme } from "../../hooks/useTheme";
import { LINKS } from "../../config/links";
import { WordMorph } from "../WordMorph/WordMorph";
import { SECTION_WORDS } from "../WordMorph/wordPools";
import { useScrolled } from "./useScrolled";
import styles from "./Header.module.css";

export function Header() {
  const active = useActiveSection();
  const scrolled = useScrolled(0.6);
  const { theme, toggle } = useTheme();
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
        <a href="#hero" className={styles.brand} aria-label="This is AIT — home">
          <WordMorph mode="header" words={words} size="md" />
        </a>

        <nav className={styles.nav} aria-label="Section navigation">
          <a href="#manifesto">Manifesto</a>
          <a href="#stack">Stack</a>
          <a href="#use-cases">What it replaces</a>
          <a href="#engine">nOS</a>
          <a href="#cta">Get involved</a>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
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
            <span>Star</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}
