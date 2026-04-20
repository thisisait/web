import { motion } from "framer-motion";
import { Section } from "../Section/Section";
import { useI18n } from "../../i18n";
import { SavingsCounter } from "./SavingsCounter";
import styles from "./UseCases.module.css";

interface Row {
  saas: string;
  foss: string;
  monthly: number;
}

const ROWS: Row[] = [
  { saas: "Notion", foss: "Outline", monthly: 16 },
  { saas: "GitHub Teams", foss: "Gitea", monthly: 4 },
  { saas: "1Password", foss: "Vaultwarden", monthly: 8 },
  { saas: "Grafana Cloud", foss: "Grafana + Loki + Tempo", monthly: 29 },
  { saas: "Auth0", foss: "Authentik", monthly: 23 },
  { saas: "Zapier", foss: "n8n", monthly: 49 },
  { saas: "Zoom", foss: "FreePBX (voice)", monthly: 15 },
  { saas: "iCloud+", foss: "Nextcloud", monthly: 10 },
  { saas: "Dropbox", foss: "Nextcloud + RustFS", monthly: 12 },
  { saas: "Jira", foss: "ERPNext", monthly: 10 },
];

const TOTAL = ROWS.reduce((s, r) => s + r.monthly, 0);

export function UseCases() {
  const { t } = useI18n();
  return (
    <Section
      id="use-cases"
      kicker={t.useCases.kicker}
      title={t.useCases.title}
    >
      <div className={styles.tableWrap}>
        <div className={styles.headerRow} role="row">
          <span>{t.useCases.colSaas}</span>
          <span>{t.useCases.colFoss}</span>
          <span className={styles.priceCol}>{t.useCases.colPrice}</span>
        </div>
        {ROWS.map((row, idx) => (
          <motion.div
            key={row.saas}
            className={styles.row}
            role="row"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{
              duration: 0.45,
              delay: idx * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className={styles.saas}>{row.saas}</span>
            <span className={styles.foss}>{row.foss}</span>
            <span className={styles.price}>
              <span className={styles.strike}>${row.monthly}</span>{" "}
              <span className={styles.zero}>$0</span>
            </span>
          </motion.div>
        ))}
      </div>

      <div className={styles.summary}>
        <div>
          <span className={styles.summaryLabel}>{t.useCases.summaryTypical}</span>
          <span className={styles.summaryTotal}>
            <SavingsCounter value={TOTAL} />
            <small>{t.useCases.perMonth}</small>
          </span>
        </div>
        <div className={styles.arrow} aria-hidden="true">
          →
        </div>
        <div>
          <span className={styles.summaryLabel}>{t.useCases.summaryAit}</span>
          <span className={[styles.summaryTotal, styles.savings].join(" ")}>
            $0<small>{t.useCases.perMonth}</small>
          </span>
        </div>
      </div>

      <p className={styles.footnote}>{t.useCases.footnote}</p>
    </Section>
  );
}
