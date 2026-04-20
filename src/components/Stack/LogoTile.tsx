import { motion } from "framer-motion";
import type { Logo } from "./logos";
import styles from "./Stack.module.css";

interface LogoTileProps {
  logo: Logo;
}

function initials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function LogoTile({ logo }: LogoTileProps) {
  const tint = logo.tint ?? "var(--ink)";
  return (
    <motion.figure
      className={styles.tile}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div className={styles.mark} aria-hidden="true">
        {logo.svg ? (
          // TODO: replace with real SVG import via ?react or ?url.
          <img src={logo.svg} alt="" loading="lazy" />
        ) : (
          <span className={styles.monogram} style={{ color: tint }}>
            {initials(logo.name)}
          </span>
        )}
      </div>
      <figcaption className={styles.caption}>{logo.name}</figcaption>
      <span className={styles.blurb}>{logo.blurb}</span>
    </motion.figure>
  );
}
