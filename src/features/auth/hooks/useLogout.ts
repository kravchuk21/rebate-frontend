import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useRouter } from '@/i18n/navigation';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetch('/api/auth/logout', { method: 'POST' }),
    onSettled: () => {
      queryClient.clear();
      router.push('/');
    },
  });
};
