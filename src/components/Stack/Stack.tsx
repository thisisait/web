import { motion } from "framer-motion";
import { Section } from "../Section/Section";
import { useI18n } from "../../i18n";
import { CATEGORY_ORDER, LOGOS } from "./logos";
import { LogoTile } from "./LogoTile";
import styles from "./Stack.module.css";

export function Stack() {
  const { t } = useI18n();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: LOGOS.filter((l) => l.category === cat),
  })).filter((g) => g.items.length > 0);

  const marquee = [...LOGOS, ...LOGOS];

  return (
    <Section
      id="stack"
      kicker={t.stack.kicker}
      title={t.stack.title}
      subtitle={t.stack.subtitle}
    >
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {marquee.map((logo, i) => (
            <span key={`${logo.name}-${i}`} className={styles.marqueeItem}>
              {logo.name}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.groups}>
        {grouped.map((group, gIdx) => (
          <motion.div
            key={group.category}
            className={styles.group}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.5, delay: gIdx * 0.05 }}
          >
            <h3 className={styles.groupLabel}>{group.category}</h3>
            <div className={styles.grid}>
              {group.items.map((logo, idx) => (
                <motion.div
                  key={logo.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <LogoTile logo={logo} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
