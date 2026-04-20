import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className={styles.footer}>
      <div className={[styles.inner, "container"].join(" ")}>
        <div className={styles.row}>
          <span className={styles.left}>
            This is AIT. — Agentic IT, manifesto edition.
          </span>
          <span className={styles.center}>
            MIT Licensed. Made on an M4 Pro.
          </span>
          {/* TODO: wire real i18n when we add Czech. */}
          <span className={styles.right} aria-hidden="true">
            <button type="button" className={styles.langBtn}>
              EN
            </button>
          </span>
        </div>
        <div className={styles.copy}>
          © {year} thisisait.eu — built by humans, maintained by agents.
        </div>
      </div>
    </footer>
  );
}
