import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
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

  return (
    <div className="min-h-screen px-6 py-12 md:py-24">
      <div className="mx-auto mb-12 w-full max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">{t("title")}</h1>
        <p className="text-muted">{t("description")}</p>
      </div>
      <FAQ locale={locale} />
    </div>
  );
}
