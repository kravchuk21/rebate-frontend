import type { MetadataRoute } from "next";
import { SITE_NAME, THEME_COLOR } from "@/shared/lib/seo";

// Served at /manifest.webmanifest. Kept locale-agnostic: start_url "/" lets the
// proxy redirect into the user's locale. The PWA file conventions (manifest,
// sw.js, icons) are excluded from the proxy matcher so they are not rewritten.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE_NAME} — Crypto Trading Rebates`,
    short_name: SITE_NAME,
    description: "Earn crypto trading rebates paid daily.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    categories: ["finance"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
