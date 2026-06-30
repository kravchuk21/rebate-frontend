import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Routes } from "@/shared/lib/routes";
import { PageIntro } from "@/shared/components/PageIntro";
import { getAllSlugs, getBrokerBySlug } from "@/features/brokers/lib/brokers";
import { BrokerArticle } from "@/features/brokers/components/BrokerArticle";
import { JsonLd } from "@/shared/components/JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/shared/lib/seo";

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
  const images = broker.logo ? [new URL(broker.logo, SITE_URL).toString()] : undefined;

  return {
    title: broker.name,
    description: broker.description,
    alternates: { canonical: url },
    openGraph: { title: broker.name, description: broker.description, url, type: "website", images },
    twitter: { card: "summary", title: broker.name, description: broker.description, images },
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
  const logoUrl = broker.logo ? new URL(broker.logo, SITE_URL).toString() : undefined;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: {
            "@type": "FinancialService",
            name: broker.name,
            url: broker.website,
            logo: logoUrl,
            image: logoUrl,
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
        logoSrc={broker.logo}
        logoWhiteSrc={broker.logoWhite}
        logoAlt={broker.name}
      />
      <BrokerArticle broker={broker} />
    </>
  );
}
