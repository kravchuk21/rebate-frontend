import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toast } from "@heroui/react";

import { routing } from "@/i18n/routing";
import QueryProvider from "@/providers/QueryProvider";
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
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          // Resolve the persisted theme before first paint to avoid a flash of the wrong theme.
          // Must stay in sync with ThemeSwitcher (storage key + resolution logic).
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';var r=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',r);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider claims={claims}>
              <Toast.Provider />
              {children}
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
