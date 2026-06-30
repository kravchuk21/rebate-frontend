import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { Routes } from "@/shared/lib/routes";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_SEGMENTS = [
  Routes.Dashboard,
  Routes.Accounts,
  Routes.Rebate,
  Routes.Withdrawal,
  Routes.Referrals,
  Routes.Admin,
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)(?=\/|$)/, "") || "/";

  const isProtected = PROTECTED_SEGMENTS.some((segment) => pathWithoutLocale.startsWith(segment));

  if (isProtected && !request.cookies.get("access_token")) {
    const locale = pathname.match(/^\/(en|ru)(?=\/|$)/)?.[1] ?? routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}?modal=login`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|sw.js|offline.html|.*\\.(?:png|svg|jpg|jpeg|webp|gif|ico)$).*)",
  ],
};
