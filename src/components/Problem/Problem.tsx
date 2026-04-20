import { motion } from "framer-motion";
import { FiDollarSign, FiEye, FiLock } from "react-icons/fi";
import type { IconType } from "react-icons";
import { Section } from "../Section/Section";
import { useI18n } from "../../i18n";
import styles from "./Problem.module.css";

const ICONS: IconType[] = [FiDollarSign, FiLock, FiEye];

export function Problem() {
  const { t } = useI18n();
  const entries = [
    t.problem.cards.saasTax,
    t.problem.cards.lockin,
    t.problem.cards.watched,
  ];

  return (
    <Section id="problem" kicker={t.problem.kicker} title={t.problem.title}>
      <div className={styles.grid}>
        {entries.map((card, idx) => {
          const Icon = ICONS[idx];
          return (
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
                <Icon />
              </div>
              <h3 className={styles.headline}>{card.headline}</h3>
              <p className={styles.body}>{card.body}</p>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
