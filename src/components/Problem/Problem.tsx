import { motion } from "framer-motion";
import { FiDollarSign, FiEye, FiLock } from "react-icons/fi";
import type { IconType } from "react-icons";
import { Section } from "../Section/Section";
import styles from "./Problem.module.css";

interface PainCard {
  Icon: IconType;
  headline: string;
  body: string;
}

const CARDS: PainCard[] = [
  {
    Icon: FiDollarSign,
    headline: "SaaS tax",
    body: "Notion. GitHub. 1Password. Vercel. Grafana Cloud. Auth0. Slack. Zoom. Together: $200–$500 every month. Forever.",
  },
  {
    Icon: FiLock,
    headline: "Vendor lock-in",
    body: "Your data lives on someone else's machine. Export is always harder than import. The exit ramp is the product.",
  },
  {
    Icon: FiEye,
    headline: "Always online, always watched",
    body: "Every keystroke leaves your building. Every feature can be revoked. Every price can rise.",
  },
];

export function Problem() {
  return (
    <Section
      id="problem"
      kicker="The problem"
      title={<>You're paying rent on your own digital life.</>}
    >
      <div className={styles.grid}>
        {CARDS.map((card, idx) => (
          <motion.article
            key={card.headline}
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.6,
              delay: idx * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ rotateX: -2, rotateY: 2, y: -4 }}
          >
            <div className={styles.icon} aria-hidden="true">
              <card.Icon />
            </div>
            <h3 className={styles.headline}>{card.headline}</h3>
            <p className={styles.body}>{card.body}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
