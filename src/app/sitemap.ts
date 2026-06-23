import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllSlugs, getPostBySlug } from "@/features/blog/lib/posts";
import { SITE_URL } from "@/shared/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      changeFrequency: "weekly",
      priority: 1.0,
    });
    entries.push({
      url: `${SITE_URL}/${locale}/faq`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      changeFrequency: "weekly",
      priority: 0.6,
    });

    for (const slug of getAllSlugs(locale)) {
      const post = getPostBySlug(locale, slug);
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: post ? new Date(post.date) : undefined,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
