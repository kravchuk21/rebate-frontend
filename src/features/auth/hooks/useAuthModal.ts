"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export type ModalType = "login" | "register" | "twoFa" | null;

export const useAuthModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentModal: ModalType = (searchParams.get("modal") as ModalType) ?? null;

  const userId = searchParams.get("user_id");

  const open = (modal: "login" | "register" | "twoFa", extra?: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", modal);
    if (extra) {
      Object.entries(extra).forEach(([key, value]) => params.set(key, value));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("user_id");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const switchTo = (modal: "login" | "register") => open(modal);

  return { currentModal, userId, open, close, switchTo };
};
