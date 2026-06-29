import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    // Required to switch Next.js onto the canary React build that actually
    // exports `ViewTransition` — `viewTransition` alone does not do this.
    gestureTransition: true,
    // HeroUI is a large barrel package imported across ~96 files. Rewriting
    // those imports to their direct source paths keeps each bundle to only the
    // components it actually uses.
    optimizePackageImports: ["@heroui/react"],
  },
  async headers() {
    return [
      {
        // Never cache the service worker script so deploys ship a fresh worker.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
