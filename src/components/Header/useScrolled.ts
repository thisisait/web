import { useEffect, useState } from "react";

/**
 * True once the user has scrolled past `thresholdVh` fraction of the viewport.
 * Default 0.6 so the header docks in once the hero is ~60% gone.
 */
export function useScrolled(thresholdVh = 0.6): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => {
      const threshold = window.innerHeight * thresholdVh;
      setScrolled(window.scrollY > threshold);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [thresholdVh]);
  return scrolled;
}
