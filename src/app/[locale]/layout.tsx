import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toast, isRTL } from "@heroui/react";

import { themeInitScript } from "@/shared/lib/theme";
import { routing } from "@/i18n/routing";
import QueryProvider from "@/providers/QueryProvider";
import { AriaRouterProvider } from "@/providers/AriaRouterProvider";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { getAccessToken } from "@/shared/lib/cookies";
import { decodeAccessToken } from "@/shared/lib/decodeToken";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
            wrong theme. beforeInteractive injects this into <head> and runs it
            before hydration. Logic lives in @/shared/lib/theme. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
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
      </body>
    </html>
  );
}
