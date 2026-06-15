import { useMutation } from '@tanstack/react-query';

import type { Auth2FaInitiateResponse } from '@/shared/api/generated/types.gen';

export const useTwoFAInitiate = () =>
  useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/2fa/initiate', { method: 'POST' });
      const body = await res.json();

      if (!res.ok) {
        throw body;
      }

      return body.data as Auth2FaInitiateResponse;
    },
  });
