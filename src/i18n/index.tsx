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

const STORAGE_KEY = "ait.locale";

function detectInitial(): LocaleCode {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
  if (stored && LOCALES.includes(stored)) return stored;
  const nav = window.navigator.language.slice(0, 2).toLowerCase() as LocaleCode;
  return LOCALES.includes(nav) ? nav : "en";
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
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
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
