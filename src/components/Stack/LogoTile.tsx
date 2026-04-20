import { motion } from "framer-motion";
import { getBrandPath } from "./brandIcons";
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
  const brandPath = getBrandPath(logo.slug);

  return (
    <motion.figure
      className={styles.tile}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div className={styles.mark} aria-hidden="true" style={{ color: tint }}>
        {brandPath ? (
          <svg
            className={styles.brandSvg}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
          >
            <path d={brandPath} fill="currentColor" />
          </svg>
        ) : (
          <span className={styles.monogram}>{initials(logo.name)}</span>
        )}
      </div>
      <figcaption className={styles.caption}>{logo.name}</figcaption>
      <span className={styles.blurb}>{logo.blurb}</span>
    </motion.figure>
  );
}
