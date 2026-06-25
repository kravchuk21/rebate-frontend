import { env } from "@/shared/lib/env";

export const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
export const SITE_NAME = "Sliceback";

export function absoluteUrl(path: string, locale: string): string {
  const normalizedPath = path === "/" ? "" : path;
  return new URL(`/${locale}${normalizedPath}`, SITE_URL).toString();
}
