/* /nos/ — the atlas page: a plate of the organism with its entries, framed as an
   encyclopaedia page. Its own React root (see nos-main.tsx); the landing page
   links here from the nav. */
import { useEffect } from "react";
import { FiGithub, FiMoon, FiSun } from "react-icons/fi";
import { I18nProvider, useI18n, localePath, LOCALES, LOCALE_LABELS } from "../i18n";
import { useTheme } from "../hooks/useTheme";
import { LINKS } from "../config/links";
import { Anatomy } from "../components/Anatomy/Anatomy";
import { Footer } from "../components/Footer/Footer";
import styles from "./NosAtlas.module.css";

function Page() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();
  const p = t.anatomy.page;

  // this page carries its own metadata; the provider wrote the landing page's
  useEffect(() => {
    document.title = p.seoTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", p.seoDescription);
  }, [p]);

  return (
    <>
      <header className={styles.header}>
        <div className={[styles.inner, "container"].join(" ")}>
          <a href={localePath(locale, "/")} className={styles.back}>{p.back}</a>
          <span className={styles.mark}>nOS<b>AIT</b></span>
          <div className={styles.actions}>
            <div className={styles.langs} role="group" aria-label={t.header.language}>
              {LOCALES.map((code) => (
                <button key={code} type="button" className={code === locale ? styles.langOn : styles.lang} onClick={() => setLocale(code)} aria-pressed={code === locale}>
                  {LOCALE_LABELS[code]}
                </button>
              ))}
            </div>
            <button type="button" className={styles.iconBtn} onClick={toggle} aria-label={theme === "dark" ? t.header.themeSwitchToLight : t.header.themeSwitchToDark}>
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <a className={styles.star} href={LINKS.github} target="_blank" rel="noopener noreferrer"><FiGithub aria-hidden="true" /><span>{t.header.star}</span></a>
          </div>
        </div>
      </header>

      <main id="main" className={styles.main}>
        <section className={styles.hero}>
          <div className={[styles.heroInner, "container"].join(" ")}>
            <p className={styles.kicker}>{p.kicker} · {p.plateLabel}</p>
            <h1 className={styles.title}><i>Organismus syntheticus</i> {p.title}</h1>
            <p className={styles.lede}>{p.lede}</p>
          </div>
        </section>

        <Anatomy page />

        <section className={styles.try}>
          <div className={[styles.tryInner, "container"].join(" ")}>
            <p className={styles.kicker}>{p.tryKicker}</p>
            <h2 className={styles.tryTitle}>{p.tryTitle}</h2>
            <p className={styles.tryBody}>{p.tryBody}</p>
            <div className={styles.tryActions}>
              <a className={styles.primary} href={LINKS.github} target="_blank" rel="noopener noreferrer"><FiGithub aria-hidden="true" /> {p.tryButton}</a>
              <a className={styles.secondary} href={localePath(locale, "/") + "#engine"}>{t.header.nav.engine} →</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function NosAtlas() {
  return (
    <I18nProvider>
      <Page />
    </I18nProvider>
  );
}
