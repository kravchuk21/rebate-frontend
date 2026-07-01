"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type ModalType = "login" | "register" | "twoFa" | null;

export const useAuthModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlModal: ModalType = (searchParams.get("modal") as ModalType) ?? null;
  const userId = searchParams.get("user_id");

  // `close()`/`open()` update the URL via router.push, but that navigation is
  // async — `urlModal` only changes once it resolves. On heavy pages (e.g. the
  // landing page) that lag makes the close button feel unresponsive, so we
  // reflect the intended state locally and let the URL catch up in the
  // background.
  const [pendingClose, setPendingClose] = useState(false);
  const currentModal: ModalType = pendingClose ? null : urlModal;
  const isOpen = currentModal !== null;

  useEffect(() => {
    if (urlModal === null) setPendingClose(false);
  }, [urlModal]);

  const open = (modal: "login" | "register" | "twoFa", extra?: Record<string, string>) => {
    setPendingClose(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", modal);
    if (extra) {
      Object.entries(extra).forEach(([key, value]) => params.set(key, value));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const close = () => {
    setPendingClose(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("user_id");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const switchTo = (modal: "login" | "register") => open(modal);

  return { currentModal, isOpen, userId, open, close, switchTo };
};
