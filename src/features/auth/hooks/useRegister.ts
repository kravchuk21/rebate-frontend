import { useMutation } from '@tanstack/react-query';

import type { AuthRegisterRequest } from '@/shared/api/generated/types.gen';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: AuthRegisterRequest) => {
      const res = await fetch('/api/auth/register', {
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
  });
};
