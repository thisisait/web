import { Section } from "../Section/Section";
import styles from "./Engine.module.css";

const FEATURES = [
  { n: "45", label: "Ansible roles", note: "every service owned by a role" },
  { n: "SSO", label: "everywhere", note: "OIDC + forward-auth, no exceptions" },
  { n: "4", label: "RBAC tiers", note: "admin / manager / user / guest" },
  { n: "ARM64", label: "Apple Silicon", note: "MLX-accelerated inference" },
];

export function Engine() {
  return (
    <Section
      id="engine"
      band="soft"
      kicker="Under the hood"
      title={<>The engine: nOS.</>}
      subtitle={<>The integration layer is the product.</>}
    >
      <div className={styles.grid}>
        <div className={styles.prose}>
          <p>
            Every FOSS service works in isolation. The hard part — and the part
            that costs engineering teams millions — is making them work{" "}
            <em>together</em>: one login, one audit trail, one backup strategy,
            one upgrade process.
          </p>
          <p>
            <strong>nOS</strong> is the open-source integration engine behind
            AIT. It's an Ansible playbook that orchestrates 45 roles, wires
            40+ services together through Authentik SSO, and gives the whole
            stack reproducibility you can verify:
          </p>
        </div>

        <div className={styles.terminal} aria-label="Example terminal command">
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
              <span className={styles.arrow}>→</span> Wipes everything
              {"\n"}
              <span className={styles.arrow}>→</span> Installs everything
              {"\n"}
              <span className={styles.arrow}>→</span> Integrates everything
              {"\n"}
              <span className={styles.arrow}>→</span> Secures everything
              {"\n\n"}
              <span className={styles.dim}>Time: ~20 minutes. Once.</span>
            </code>
          </pre>
        </div>
      </div>

      <ul className={styles.features}>
        {FEATURES.map((f) => (
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
