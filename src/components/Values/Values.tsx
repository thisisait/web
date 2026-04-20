import { motion } from "framer-motion";
import { Section } from "../Section/Section";
import styles from "./Values.module.css";

const VALUES = [
  {
    title: "100% FOSS.",
    body: "No proprietary dependencies. Forkable on day one.",
  },
  {
    title: "Self-hosted by default.",
    body: "Your data never leaves your machine.",
  },
  {
    title: "Reproducible.",
    body: "One command, every time. No snowflakes.",
  },
  {
    title: "Agentic.",
    body: "The stack maintains itself so you don't have to.",
  },
];

export function Values() {
  return (
    <Section id="values" kicker="Principles" title={<>Non-negotiables.</>}>
      <ul className={styles.pills}>
        {VALUES.map((v, i) => (
          <motion.li
            key={v.title}
            className={styles.pill}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className={styles.title}>{v.title}</span>
            <span className={styles.body}>{v.body}</span>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
