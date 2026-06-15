import { useMutation } from '@tanstack/react-query';

import { useRouter } from '@/i18n/navigation';

export const useTwoFAVerify = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { user_id: string; code: string }) => {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        throw body;
      }

      return body;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
  });
};
