import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    // Required to switch Next.js onto the canary React build that actually
    // exports `ViewTransition` — `viewTransition` alone does not do this.
    gestureTransition: true,
  },
};

export default withNextIntl(nextConfig);
