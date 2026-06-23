export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sliceback.trade";
export const SITE_NAME = "Sliceback";

export function absoluteUrl(path: string, locale: string): string {
  const normalizedPath = path === "/" ? "" : path;
  return new URL(`/${locale}${normalizedPath}`, SITE_URL).toString();
}
