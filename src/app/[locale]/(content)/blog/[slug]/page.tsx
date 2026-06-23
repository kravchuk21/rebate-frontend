import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Routes } from "@/shared/lib/routes";
import { PageIntro } from "@/shared/components/PageIntro";
import { getAllSlugs, getPostBySlug } from "@/features/blog/lib/posts";
import { BlogArticle } from "@/features/blog/components/BlogArticle";
import { JsonLd } from "@/shared/components/JsonLd";
import { SITE_NAME, absoluteUrl } from "@/shared/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllSlugs(params.locale).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);

  if (!post) return {};

  const url = absoluteUrl(`${Routes.Blog}/${slug}`, locale);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
    twitter: { card: "summary", title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "blog" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const url = absoluteUrl(`${Routes.Blog}/${slug}`, locale);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          mainEntityOfPage: url,
          url,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        }}
      />
      <PageIntro
        breadcrumbs={[
          { label: tCommon("home"), href: Routes.Home },
          { label: t("title"), href: Routes.Blog },
          { label: post.title },
        ]}
        title={post.title}
      />
      <BlogArticle post={post} />
    </>
  );
}
