import { motion } from "framer-motion";
import { Section } from "../Section/Section";
import styles from "./Manifesto.module.css";

const TIMELINE = [
  { era: "1960s", label: "Mainframe", note: "one machine, everyone" },
  { era: "1980s", label: "PC", note: "power to the desk" },
  { era: "2000s", label: "Internet", note: "the web happens" },
  { era: "2010s", label: "Cloud", note: "power to someone else" },
  { era: "2020s", label: "Self-hosted", note: "back to the desk" },
  { era: "NOW", label: "AIT", note: "self-managing, agentic", highlight: true },
];

export function Manifesto() {
  return (
    <Section
      id="manifesto"
      band="soft"
      kicker="Manifesto"
      title={<>The mainframe came home.</>}
    >
      <div className={styles.grid}>
        <div className={styles.prose}>
          <p>
            In the 1960s, one machine served everyone. Then PCs decentralized
            computing — power came to your desk. Then the cloud re-centralized
            it — power went back to someone else's datacenter.
          </p>
          <p>
            Now Apple Silicon runs circles around the rack-mounted servers of a
            decade ago. Docker standardized deployment. Ansible made
            infrastructure reproducible. Local LLMs made a built-in DevOps
            agent possible.
          </p>
          <p>
            <strong>AIT — Agentic IT —</strong> is the collapse of that arc.
            One machine on your desk, running your entire digital life.
            Self-hosted. Self-updating. Self-managing. Open source end-to-end.
          </p>
          <p className={styles.closing}>
            This isn't a homelab hobby. It's the next category of
            infrastructure.
          </p>
        </div>
        <ol className={styles.timeline}>
          {TIMELINE.map((entry, idx) => (
            <motion.li
              key={entry.era}
              className={[
                styles.entry,
                entry.highlight ? styles.highlight : "",
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
