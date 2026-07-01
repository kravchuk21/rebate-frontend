"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

/**
 * Theme controller for the app. Uses `data-theme` on <html> because HeroUI's
 * built-in light/dark themes read from that attribute. next-themes handles
 * persistence, system-preference resolution, and no-flash injection.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
