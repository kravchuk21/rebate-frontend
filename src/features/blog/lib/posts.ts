import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

const localeDir = (locale: string) => path.join(BLOG_DIR, locale);

const readPostFile = (locale: string, slug: string): string | null => {
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

export const getAllPosts = (locale: string): BlogPostMeta[] =>
  getAllSlugs(locale)
    .map((slug) => {
      const raw = readPostFile(locale, slug);
      if (!raw) return null;
      const { data } = matter(raw);
      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
      };
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPostBySlug = (locale: string, slug: string): BlogPost | null => {
  const raw = readPostFile(locale, slug);
  if (!raw) return null;

  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    contentHtml: marked.parse(content, { async: false }) as string,
  };
};
