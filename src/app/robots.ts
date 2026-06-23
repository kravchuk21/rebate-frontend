import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/lib/seo";

const disallow = [
  "/api/",
  "/*/dashboard",
  "/*/profile",
  "/*/accounts",
  "/*/rebate",
  "/*/referrals",
  "/*/withdrawal",
  "/*/admin",
  "/*/admin/*",
  "/*/verify-email",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      {
        userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot", "PerplexityBot"],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
