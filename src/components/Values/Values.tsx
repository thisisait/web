import { motion } from "framer-motion";
import { Section } from "../Section/Section";
import { useI18n } from "../../i18n";
import styles from "./Values.module.css";

export function Values() {
  const { t } = useI18n();
  return (
    <Section id="values" kicker={t.values.kicker} title={t.values.title}>
      <ul className={styles.pills}>
        {t.values.items.map((v, i) => (
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
