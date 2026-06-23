import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { Routes } from "@/shared/lib/routes";
import { PageIntro } from "@/shared/components/PageIntro";
import { FAQ } from "@/features/faq/components/FAQ";
import { JsonLd } from "@/shared/components/JsonLd";
import { absoluteUrl } from "@/shared/lib/seo";

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
  const t = await getTranslations({ locale, namespace: "faq" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = tMeta("faq.description");
  const url = absoluteUrl(Routes.Faq, locale);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

interface FAQCategory {
  title: string;
  items: { title: string; content: string }[];
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const categories = t.raw("categories") as FAQCategory[];
  const questions = categories.flatMap((category) => category.items);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions.map((item) => ({
            "@type": "Question",
            name: item.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.content,
            },
          })),
        }}
      />
      <PageIntro
        breadcrumbs={[
          { label: tCommon("home"), href: Routes.Home },
          { label: t("title") },
        ]}
        title={t("title")}
        description={t("description")}
      />
      <FAQ locale={locale} />
    </>
  );
}
