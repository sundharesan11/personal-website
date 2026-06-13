// src/scripts/theme.ts
export type Theme = "light" | "dark";
export const STORAGE_KEY = "theme";

/** Pure resolver: stored preference wins, else fall back to system. */
export function resolveTheme(stored: string | null, systemPrefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return systemPrefersDark ? "dark" : "light";
}

/** Apply a theme to the document and persist the explicit choice. */
export function applyTheme(theme: Theme, persist = true): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  if (persist) localStorage.setItem(STORAGE_KEY, theme);
}

/** Read current applied theme from the DOM. */
export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Wire a toggle button. Call once on each page load. */
export function initToggle(button: HTMLElement): void {
  button.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}
