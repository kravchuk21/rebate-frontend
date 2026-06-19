"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useAuth, type AuthState } from "@/features/auth/components/AuthProvider";
import { usePathname, useRouter } from "@/i18n/navigation";
import { MODAL_ACCESS, MODAL_PARAMS } from "@/shared/lib/modals";
import { Modals } from "@/shared/lib/routes";

const MODAL_KEY = "modal";

export const canAccessModal = (id: Modals, auth: AuthState): boolean => {
  switch (MODAL_ACCESS[id]) {
    case "public":
      return true;
    case "auth":
      return auth.isAuthenticated;
    case "admin":
      return auth.role === "admin";
    default:
      return false;
  }
};

/**
 * URL-driven modal state. A modal is open when `?modal=<id>` is present AND the
 * current user is allowed to see it. `open`/`close` write the query string via
 * the i18n-aware router, so modals are deep-linkable and survive refresh while
 * back/forward toggles them.
 */
export const useModal = (id: Modals) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const allowed = canAccessModal(id, auth);
  const isOpen = allowed && searchParams.get(MODAL_KEY) === id;

  const open = useCallback(
    (params?: Record<string, string>) => {
      if (!canAccessModal(id, auth)) return;
      const next = new URLSearchParams(searchParams.toString());
      next.set(MODAL_KEY, id);
      if (params) {
        for (const [key, value] of Object.entries(params)) next.set(key, value);
      }
      router.push(`${pathname}?${next.toString()}`);
    },
    [auth, id, pathname, router, searchParams],
  );

  const close = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete(MODAL_KEY);
    for (const key of MODAL_PARAMS[id] ?? []) next.delete(key);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }, [id, pathname, router, searchParams]);

  const param = useCallback((key: string) => searchParams.get(key), [searchParams]);

  return { isOpen, open, close, param };
};
