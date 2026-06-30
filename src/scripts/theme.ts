export type Theme = "light" | "dark" | "cream";
export const STORAGE_KEY = "theme";
const THEMES: Theme[] = ["light", "cream", "dark"];

/** Pure resolver: stored preference wins (light/dark/cream), else use the site default. */
export function resolveTheme(stored: string | null, _systemPrefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark" || stored === "cream") return stored;
  return "light";
}

/** Apply a theme to the document and persist the explicit choice. */
export function applyTheme(theme: Theme, persist = true): void {
  const el = document.documentElement;
  el.classList.toggle("dark", theme === "dark");
  el.classList.toggle("theme-cream", theme === "cream");
  if (persist) localStorage.setItem(STORAGE_KEY, theme);
}

/** Read current applied theme from the DOM. */
export function currentTheme(): Theme {
  const el = document.documentElement;
  if (el.classList.contains("dark")) return "dark";
  if (el.classList.contains("theme-cream")) return "cream";
  return "light";
}

/** Next theme in the cycle light -> cream -> dark -> light. */
export function nextTheme(t: Theme): Theme {
  return THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
}

/** Wire a cycle toggle button. Call once on each page load. */
export function initToggle(button: HTMLElement): void {
  const render = () => {
    const t = currentTheme();
    button.setAttribute("data-theme-state", t);
    button.setAttribute("aria-label", `Theme: ${t}. Switch theme.`);
  };
  render();
  button.addEventListener("click", () => { applyTheme(nextTheme(currentTheme())); render(); });
}
