import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { WordMorph } from "../WordMorph/WordMorph";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import styles from "./Hero.module.css";

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.blob} aria-hidden="true" />
      <div className={[styles.inner, "container"].join(" ")}>
        <h1 id="hero-title" className={styles.title}>
          <WordMorph mode="hero" size="xxl" />
        </h1>
        <motion.p
          className={styles.tagline}
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          This is AIT. A new category of self-hosted, agentic, open-source
          infrastructure.
        </motion.p>
        <motion.p
          className={styles.subTagline}
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          One stack. Forty services. Zero SaaS bills.
        </motion.p>
      </div>
      <a href="#problem" className={styles.scrollHint} aria-label="Scroll to next section">
        <motion.span
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <FiChevronDown />
        </motion.span>
      </a>
    </section>
  );
}
