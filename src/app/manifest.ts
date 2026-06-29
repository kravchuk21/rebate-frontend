import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/shared/lib/seo";

// Served at /manifest.webmanifest. Kept locale-agnostic: start_url "/" lets the
// proxy redirect into the user's locale. The PWA file conventions (manifest,
// sw.js, icons) are excluded from the proxy matcher so they are not rewritten.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Crypto Trading Rebates`,
    short_name: SITE_NAME,
    description: "Earn crypto trading rebates paid daily.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0B0B0F",
    theme_color: "#0B0B0F",
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
