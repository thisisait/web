import { Section } from "../Section/Section";
import { useI18n } from "../../i18n";
import styles from "./Engine.module.css";

export function Engine() {
  const { t } = useI18n();
  return (
    <Section
      id="engine"
      band="soft"
      kicker={t.engine.kicker}
      title={t.engine.title}
      subtitle={t.engine.subtitle}
    >
      <div className={styles.grid}>
        <div className={styles.prose}>
          <p>{t.engine.para1}</p>
          <p>{t.engine.para2}</p>
        </div>

        <div className={styles.terminal} aria-label={t.engine.terminalAriaLabel}>
          <div className={styles.terminalBar}>
            <span />
            <span />
            <span />
          </div>
          <pre className={styles.terminalBody}>
            <code>
              <span className={styles.prompt}>$</span>{" "}
              <span className={styles.cmd}>
                ansible-playbook main.yml -K -e blank=true
              </span>
              {"\n\n"}
              <span className={styles.arrow}>→</span> {t.engine.terminalLines[0]}
              {"\n"}
              <span className={styles.arrow}>→</span> {t.engine.terminalLines[1]}
              {"\n"}
              <span className={styles.arrow}>→</span> {t.engine.terminalLines[2]}
              {"\n"}
              <span className={styles.arrow}>→</span> {t.engine.terminalLines[3]}
              {"\n\n"}
              <span className={styles.dim}>{t.engine.terminalFooter}</span>
            </code>
          </pre>
        </div>
      </div>

      <ul className={styles.features}>
        {t.engine.features.map((f) => (
          <li key={f.label} className={styles.feature}>
            <span className={styles.featureN}>{f.n}</span>
            <span className={styles.featureLabel}>{f.label}</span>
            <span className={styles.featureNote}>{f.note}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
