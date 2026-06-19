import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Routes } from "@/shared/lib/routes";
import { PageIntro } from "@/shared/components/PageIntro";
import { FAQ } from "@/features/faq/components/FAQ";

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

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { label: tCommon("home"), href: getPathname({ href: Routes.Home, locale }) },
          { label: t("title") },
        ]}
        title={t("title")}
        description={t("description")}
      />
      <FAQ locale={locale} />
    </>
  );
}
