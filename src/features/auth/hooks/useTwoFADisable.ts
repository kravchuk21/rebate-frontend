import { useMutation } from '@tanstack/react-query';

export const useTwoFADisable = () =>
  useMutation({
    mutationFn: async (data: { password: string; code: string }) => {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw body;
      }
    },
  });
