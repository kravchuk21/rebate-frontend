import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const BROKERS_DIR = path.join(process.cwd(), "src/content/brokers");

export interface BrokerMeta {
  slug: string;
  name: string;
  description: string;
  /** Lower numbers are listed first. Defaults to 0. */
  order: number;
  website?: string;
  /** Referral / promo code the user enters at the broker. */
  code?: string;
  founded?: string;
  rebate?: string;
  /** Path (under /public) to the broker logo for light backgrounds (used in social/SEO previews). */
  logo?: string;
  /** Path (under /public) to the white logo variant, shown on the dark UI. */
  logoWhite?: string;
}

export interface Broker extends BrokerMeta {
  contentHtml: string;
}

const localeDir = (locale: string) => path.join(BROKERS_DIR, locale);

const readBrokerFile = (locale: string, slug: string): string | null => {
  const filePath = path.join(localeDir(locale), `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
};

export const getAllSlugs = (locale: string): string[] => {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
};

const toMeta = (slug: string, data: Record<string, unknown>): BrokerMeta => ({
  slug,
  name: data.name as string,
  description: data.description as string,
  order: typeof data.order === "number" ? data.order : 0,
  website: data.website as string | undefined,
  code: data.code as string | undefined,
  founded: data.founded as string | undefined,
  rebate: data.rebate as string | undefined,
  logo: data.logo as string | undefined,
  logoWhite: data.logoWhite as string | undefined,
});

export const getAllBrokers = (locale: string): BrokerMeta[] =>
  getAllSlugs(locale)
    .map((slug) => {
      const raw = readBrokerFile(locale, slug);
      if (!raw) return null;
      const { data } = matter(raw);
      return toMeta(slug, data);
    })
    .filter((broker): broker is BrokerMeta => broker !== null)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

export const getBrokerBySlug = (locale: string, slug: string): Broker | null => {
  const raw = readBrokerFile(locale, slug);
  if (!raw) return null;

  const { data, content } = matter(raw);

  return {
    ...toMeta(slug, data),
    contentHtml: marked.parse(content, { async: false }) as string,
  };
};
