import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { Routes } from "@/shared/lib/routes";
import { PageIntro } from "@/shared/components/PageIntro";
import { getAllBrokers } from "@/features/brokers/lib/brokers";
import { BrokerList } from "@/features/brokers/components/BrokerList";
import { Typography } from "@heroui/react";
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
  const t = await getTranslations({ locale, namespace: "brokers" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = tMeta("brokers.description");
  const url = absoluteUrl(Routes.Brokers, locale);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function BrokersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brokers" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const brokers = getAllBrokers(locale);

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: tCommon("home"), href: Routes.Home }, { label: t("title") }]}
        title={t("title")}
        description={t("description")}
      />
      {brokers.length > 0 ? (
        <BrokerList brokers={brokers} />
      ) : (
        <Typography.Paragraph color="muted" className="text-center">
          {t("empty")}
        </Typography.Paragraph>
      )}
    </>
  );
}
