import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Routes } from "@/shared/lib/routes";
import { PageIntro } from "@/shared/components/PageIntro";
import { getAllSlugs, getBrokerBySlug } from "@/features/brokers/lib/brokers";
import { BrokerArticle } from "@/features/brokers/components/BrokerArticle";
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
  const broker = getBrokerBySlug(locale, slug);

  if (!broker) return {};

  const url = absoluteUrl(`${Routes.Brokers}/${slug}`, locale);

  return {
    title: broker.name,
    description: broker.description,
    alternates: { canonical: url },
    openGraph: { title: broker.name, description: broker.description, url, type: "website" },
    twitter: { card: "summary", title: broker.name, description: broker.description },
  };
}

export default async function BrokerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const broker = getBrokerBySlug(locale, slug);

  if (!broker) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "brokers" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const url = absoluteUrl(`${Routes.Brokers}/${slug}`, locale);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: {
            "@type": "FinancialService",
            name: broker.name,
            ...(broker.website ? { url: broker.website } : {}),
          },
          description: broker.description,
          url,
          author: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        }}
      />
      <PageIntro
        breadcrumbs={[
          { label: tCommon("home"), href: Routes.Home },
          { label: t("title"), href: Routes.Brokers },
          { label: broker.name },
        ]}
        title={broker.name}
        description={broker.description}
      />
      <BrokerArticle broker={broker} />
    </>
  );
}
