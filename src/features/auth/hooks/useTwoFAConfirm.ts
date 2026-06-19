import { useMutation } from "@tanstack/react-query";

import type { Auth2FaConfirmResponse } from "@/shared/api/generated/types.gen";

export const useTwoFAConfirm = () =>
  useMutation({
    mutationFn: async (data: { password: string; code: string }) => {
      const res = await fetch("/api/auth/2fa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        throw body;
      }

      return body.data as Auth2FaConfirmResponse;
    },
  });
