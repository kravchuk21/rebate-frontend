import { useMutation } from '@tanstack/react-query';

import { useRouter } from '@/i18n/navigation';
import type { AuthLoginRequest, AuthTwoFaResponse } from '@/shared/api/generated/types.gen';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: AuthLoginRequest) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        throw body;
      }

      return body as { success?: boolean; data?: AuthTwoFaResponse };
    },
    onSuccess: (data) => {
      if (data.data?.['2fa_required']) {
        router.push(`/2fa?user_id=${data.data.user_id}`);
        return;
      }

      router.push('/dashboard');
    },
  });
};
