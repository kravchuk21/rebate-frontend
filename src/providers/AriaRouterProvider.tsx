"use client";

import type { ReactNode } from "react";
import { RouterProvider, I18nProvider } from "@heroui/react";
import { useLocale } from "next-intl";

import { useRouter, getPathname } from "@/i18n/navigation";

/** Hrefs that must not be rewritten with the locale prefix (external, hash, protocol links). */
const PASSTHROUGH_HREF = /^(https?:|mailto:|tel:|#)/;

/**
 * Routes every react-aria-based link (HeroUI `Link`, `Button` with `href`, etc.)
 * through next-intl's client router instead of the browser's default full-page
 * navigation.
 *
 * Without this, components built on react-aria-components fall back to a native
 * `<a>` navigation, which reloads the document and skips our `ViewTransition`
 * page animations (see `PageTransition`). Wiring `navigate` to the intl router
 * makes those links navigate client-side so the transitions fire — and keeps
 * the locale prefix correct for both the navigation and the rendered `href`.
 *
 * Also hosts react-aria's `I18nProvider` so HeroUI components share the active
 * locale. It lives here (a Client Component) rather than the root layout because
 * `I18nProvider` relies on `createContext` and cannot render in a Server Component.
 */
export function AriaRouterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const locale = useLocale();

  return (
    <I18nProvider locale={locale}>
      <RouterProvider
        navigate={(href) => router.push(href)}
        useHref={(href) => (PASSTHROUGH_HREF.test(href) ? href : getPathname({ href, locale }))}
      >
        {children}
      </RouterProvider>
    </I18nProvider>
  );
}
