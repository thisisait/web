import { ActiveSectionProvider } from "./hooks/useActiveSection";
import { I18nProvider } from "./i18n";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { Problem } from "./components/Problem/Problem";
import { Manifesto } from "./components/Manifesto/Manifesto";
import { Stack } from "./components/Stack/Stack";
import { UseCases } from "./components/UseCases/UseCases";
import { Engine } from "./components/Engine/Engine";
import { Values } from "./components/Values/Values";
import { CTA } from "./components/CTA/CTA";
import { Footer } from "./components/Footer/Footer";

export default function App() {
  return (
    <I18nProvider>
      <ActiveSectionProvider>
        <Header />
        <main id="main">
          <Hero />
          <Problem />
          <Manifesto />
          <Stack />
          <UseCases />
          <Engine />
          <Values />
          <CTA />
        </main>
        <Footer />
      </ActiveSectionProvider>
    </I18nProvider>
  );
}
