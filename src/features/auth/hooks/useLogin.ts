import { useMutation } from "@tanstack/react-query";

import { useRouter } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";
import type { AuthLoginRequest, AuthTwoFaResponse } from "@/shared/api/generated/types.gen";
import { useAuthModal } from "./useAuthModal";

export const useLogin = () => {
  const router = useRouter();
  const { open } = useAuthModal();

  return useMutation({
    mutationFn: async (data: AuthLoginRequest) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        throw body;
      }

      return body as { success?: boolean; data?: AuthTwoFaResponse };
    },
    onSuccess: (data) => {
      if (data.data?.["2fa_required"] && data.data.user_id) {
        open("twoFa", { user_id: data.data.user_id });
        return;
      }

      router.push(Routes.Dashboard);
    },
  });
};
