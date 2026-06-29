import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Toast, isRTL } from "@heroui/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { themeInitScript } from "@/shared/lib/theme";
import { routing } from "@/i18n/routing";
import QueryProvider from "@/providers/QueryProvider";
import { AriaRouterProvider } from "@/providers/AriaRouterProvider";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { getAccessToken } from "@/shared/lib/cookies";
import { decodeAccessToken } from "@/shared/lib/decodeToken";
import { SITE_URL, SITE_NAME, THEME_COLOR } from "@/shared/lib/seo";
import { ServiceWorkerRegister } from "@/providers/ServiceWorkerRegister";
import "../globals.css";

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  return {
    metadataBase: new URL(SITE_URL),
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: SITE_NAME,
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} — Crypto Trading Rebates Paid Daily`,
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const token = await getAccessToken();
  const claims = token ? decodeAccessToken(token) : null;

  return (
    <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"} data-theme="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        {/* Resolve the persisted theme before first paint to avoid a flash of the
            wrong theme. Runs synchronously as the browser parses it — before the
            body content renders. Logic lives in @/shared/lib/theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AriaRouterProvider>
            <QueryProvider>
              <AuthProvider claims={claims}>
                <Toast.Provider />
                {children}
              </AuthProvider>
            </QueryProvider>
          </AriaRouterProvider>
        </NextIntlClientProvider>
        <SpeedInsights/>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
