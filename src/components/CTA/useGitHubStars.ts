import { useEffect, useState } from "react";
import { GITHUB_REPO } from "../../config/links";

const CACHE_KEY = "ait.stars";
const CACHE_TTL_MS = 10 * 60 * 1000;

interface CachedEntry {
  count: number;
  at: number;
}

function readCache(): number | null {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedEntry;
    if (Date.now() - entry.at > CACHE_TTL_MS) return null;
    return entry.count;
  } catch {
    return null;
  }
}

function writeCache(count: number) {
  try {
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ count, at: Date.now() } satisfies CachedEntry),
    );
  } catch {
    // ignore
  }
}

export function useGitHubStars(): number | null {
  const [stars, setStars] = useState<number | null>(() => readCache());

  useEffect(() => {
    if (stars !== null) return;
    let cancelled = false;
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const count = data.stargazers_count;
        if (typeof count === "number") {
          setStars(count);
          writeCache(count);
        }
      })
      .catch(() => {
        // silent — render placeholder
      });
    return () => {
      cancelled = true;
    };
  }, [stars]);

  return stars;
}
