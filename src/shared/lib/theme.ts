export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME: Theme = "system";

/** Resolve a theme preference to a concrete value, reading the OS setting for "system". */
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

/** Apply a theme preference to the document root. Client-only. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", resolveTheme(theme));
}

/**
 * Inline script that resolves the persisted theme before first paint to avoid a
 * flash of the wrong theme. Kept as a string so it can run via next/script
 * (strategy="beforeInteractive") and is intentionally self-contained — it must
 * not import anything, since it executes before the bundle loads.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'${DEFAULT_THEME}';var r=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',r);}catch(e){}})();`;
