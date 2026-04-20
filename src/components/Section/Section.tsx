import { motion } from "framer-motion";
import type { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  kicker?: ReactNode;
  band?: "soft" | "default";
  children: ReactNode;
  labelledBy?: string;
}

export function Section({
  id,
  title,
  subtitle,
  kicker,
  band = "default",
  children,
  labelledBy,
}: SectionProps) {
  const titleId = labelledBy ?? `${id}-title`;
  return (
    <section
      id={id}
      className={[styles.section, band === "soft" ? styles.soft : ""].join(" ")}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className={[styles.inner, "container"].join(" ")}>
        {(kicker || title || subtitle) && (
          <motion.header
            className={styles.head}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {kicker && <p className={styles.kicker}>{kicker}</p>}
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </motion.header>
        )}
        {children}
      </div>
    </section>
  );
}
