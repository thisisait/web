import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SECTIONS, type SectionId } from "../types/sections";

interface ActiveSectionContextValue {
  active: SectionId;
}

const ActiveSectionContext = createContext<ActiveSectionContextValue>({
  active: "hero",
});

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>("hero");
  const visibility = useRef<Map<SectionId, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id as SectionId;
          visibility.current.set(id, entry.intersectionRatio);
        });
        let best: SectionId = "hero";
        let bestRatio = -1;
        for (const id of SECTIONS) {
          const r = visibility.current.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.1, 0.5, 1],
      },
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const value = useMemo(() => ({ active }), [active]);
  return (
    <ActiveSectionContext.Provider value={value}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection(): SectionId {
  return useContext(ActiveSectionContext).active;
}
