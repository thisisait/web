import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface SavingsCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function SavingsCounter({
  value,
  prefix = "$",
  suffix = "",
  duration = 1.6,
}: SavingsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, reduced, value, duration, mv]);

  return (
    <motion.span ref={ref}>
      {rounded}
    </motion.span>
  );
}
