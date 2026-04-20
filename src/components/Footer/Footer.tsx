import { useI18n, LOCALES, LOCALE_LABELS } from "../../i18n";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  const { t, locale, setLocale } = useI18n();

  return (
    <footer id="footer" className={styles.footer}>
      <div className={[styles.inner, "container"].join(" ")}>
        <div className={styles.row}>
          <span className={styles.left}>{t.footer.tagline}</span>
          <span className={styles.center}>{t.footer.license}</span>
          <span className={styles.right}>
            <div
              className={styles.langGroup}
              role="group"
              aria-label={t.header.language}
            >
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={[
                    styles.langBtn,
                    code === locale ? styles.langBtnActive : "",
                  ].join(" ")}
                  onClick={() => setLocale(code)}
                  aria-pressed={code === locale}
                >
                  {LOCALE_LABELS[code]}
                </button>
              ))}
            </div>
          </span>
        </div>
        <div className={styles.copy}>{t.footer.copy(year)}</div>
      </div>
    </footer>
  );
}
