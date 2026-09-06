import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/** Stored choice first, then the OS preference. */
function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Private browsing can make localStorage throw on read.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Light/dark theme, applied as a class on <html> for Tailwind's `dark:` variant.
 *
 * The previous version initialised from `localStorage.theme`, which is
 * undefined on a first visit, and then called `classList.add(undefined)` —
 * a runtime error for every new visitor.
 */
export default function useDarkSide(): [Theme, (theme: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Nothing to do; the theme still applies for this session.
    }
  }, [theme]);

  const update = useCallback((next: Theme) => setTheme(next), []);

  return [theme, update];
}
