export type LocaleCode = "en" | "cs" | "de" | "fr";

export const LOCALES: LocaleCode[] = ["en", "cs", "de", "fr"];

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  en: "EN",
  cs: "CZ",
  de: "DE",
  fr: "FR",
};

export interface Messages {
  localeName: string;

  /** SEO metadata injected into <title> and <meta name="description">
   *  both at build time (per-locale HTML) and at runtime (on locale switch). */
  seo: {
    title: string;
    description: string;
  };

  header: {
    homeAria: string;
    nav: {
      manifesto: string;
      stack: string;
      useCases: string;
      engine: string;
      getInvolved: string;
    };
    themeSwitchToLight: string;
    themeSwitchToDark: string;
    star: string;
    language: string;
  };

  hero: {
    tagline: string;
    subTagline: string;
    scrollHintAria: string;
  };

  problem: {
    kicker: string;
    title: string;
    cards: {
      saasTax: { headline: string; body: string };
      lockin: { headline: string; body: string };
      watched: { headline: string; body: string };
    };
  };

  manifesto: {
    kicker: string;
    title: string;
    /** Paragraphs of prose. The first one contains a <strong>…</strong> segment
     *  encoded as %STRONG_START% / %STRONG_END% so locales stay plain-text. */
    paragraphs: string[];
    closing: string;
    timeline: Array<{ era: string; label: string; note: string }>;
  };

  stack: {
    kicker: string;
    title: string;
    subtitle: string;
    categories: {
      Infrastructure: string;
      Observability: string;
      Productivity: string;
      DevOps: string;
      "Media & Home": string;
      "AI & Agentic": string;
      Business: string;
      Communication: string;
      Engineering: string;
    };
  };

  useCases: {
    kicker: string;
    title: string;
    colSaas: string;
    colFoss: string;
    colPrice: string;
    summaryTypical: string;
    summaryAit: string;
    perMonth: string;
    footnote: string;
  };

  engine: {
    kicker: string;
    title: string;
    subtitle: string;
    para1: string;
    para2: string;
    terminalAriaLabel: string;
    /** Four arrow lines in the terminal mock. Order: wipes, installs, integrates, secures. */
    terminalLines: [string, string, string, string];
    /** Footer line of the terminal mock, e.g. "Time: ~20 minutes. Once." */
    terminalFooter: string;
    features: Array<{ n: string; label: string; note: string }>;
  };

  values: {
    kicker: string;
    title: string;
    items: Array<{ title: string; body: string }>;
  };

  cta: {
    kicker: string;
    title: string;
    subtitle: string;
    star: { title: string; body: string; button: string; starsAria: (n: string) => string };
    coffee: { title: string; body: string; button: string };
    secondaryMuted: string;
    secondaryAria: string;
    readDocs: string;
    followTwitter: string;
    joinMatrix: string;
    rss: string;
  };

  footer: {
    tagline: string;
    license: string;
    copy: (year: number) => string;
  };
}
