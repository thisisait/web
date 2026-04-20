import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import cs from "./cs";
import de from "./de";
import en from "./en";
import fr from "./fr";
import { LOCALES, type LocaleCode, type Messages } from "./types";

export { LOCALES, LOCALE_LABELS } from "./types";
export type { LocaleCode, Messages } from "./types";

const DICTIONARIES: Record<LocaleCode, Messages> = { en, cs, de, fr };

/** Locales that receive a URL prefix. "en" lives at the root. */
const PREFIXED = LOCALES.filter((l): l is Exclude<LocaleCode, "en"> => l !== "en");

const LOCALE_PATH_RE = new RegExp(`^/(${PREFIXED.join("|")})(?:/|$)`);

function detectFromPath(pathname: string): LocaleCode {
  const match = pathname.match(LOCALE_PATH_RE);
  return (match?.[1] as LocaleCode) ?? "en";
}

function pathnameFor(locale: LocaleCode): string {
  return locale === "en" ? "/" : `/${locale}/`;
}

function detectInitial(): LocaleCode {
  if (typeof window === "undefined") return "en";
  return detectFromPath(window.location.pathname);
}

interface I18nContextValue {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(detectInitial);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Back/forward navigation: keep React state in sync with the URL.
  useEffect(() => {
    const handler = () => {
      setLocaleState(detectFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const setLocale = useCallback((code: LocaleCode) => {
    const newPath = pathnameFor(code);
    const url = newPath + window.location.search + window.location.hash;
    // pushState so the back button goes to the previous locale.
    window.history.pushState(null, "", url);
    setLocaleState(code);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: DICTIONARIES[locale] }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
