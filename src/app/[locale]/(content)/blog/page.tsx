import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { Routes } from "@/shared/lib/routes";
import { PageIntro } from "@/shared/components/PageIntro";
import { getAllPosts } from "@/features/blog/lib/posts";
import { BlogList } from "@/features/blog/components/BlogList";
import { Typography } from "@heroui/react";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const posts = getAllPosts(locale);

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { label: tCommon("home"), href: Routes.Home },
          { label: t("title") },
        ]}
        title={t("title")}
        description={t("description")}
      />
      {posts.length > 0 ? (
        <BlogList posts={posts} />
      ) : (
        <Typography.Paragraph color="muted" className="text-center">{t("empty")}</Typography.Paragraph>
      )}
    </>
  );
}
