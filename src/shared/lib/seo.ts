import { env } from "@/shared/lib/env";

export const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
export const SITE_NAME = "Sliceback";

// Brand theme color. Shared by the PWA manifest, the viewport meta tag, and the
// offline fallback so they never drift apart.
export const THEME_COLOR = "#0B0B0F";

export function absoluteUrl(path: string, locale: string): string {
  const normalizedPath = path === "/" ? "" : path;
  return new URL(`/${locale}${normalizedPath}`, SITE_URL).toString();
}
