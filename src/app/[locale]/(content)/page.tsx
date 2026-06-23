import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { getAccessToken } from "@/shared/lib/cookies";
import { Routes } from "@/shared/lib/routes";
import { LandingClient } from "@/features/landing/components/LandingClient";
import { JsonLd } from "@/shared/components/JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/shared/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = "Crypto Trading Rebates Paid Daily";
  const description = t("home.description");
  const url = absoluteUrl(Routes.Home, locale);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ modal?: string; ref?: string }>;
}) {
  const { locale } = await params;
  const token = await getAccessToken();

  if (token) {
    redirect({ href: Routes.Dashboard, locale });
  }

  const { ref } = await searchParams;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl(Routes.Home, locale),
        }}
      />
      <LandingClient defaultReferralCode={ref} />
    </>
  );
}
