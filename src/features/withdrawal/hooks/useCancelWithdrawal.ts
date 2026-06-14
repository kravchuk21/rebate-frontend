import '@/shared/api/instance';

import { useQueryClient } from '@tanstack/react-query';

import { getBalanceQueryKey } from '@/shared/api/generated/hooks/withdrawal/useGetBalanceQuery.gen';
import { getWithdrawalsQueryKey } from '@/shared/api/generated/hooks/withdrawal/useGetWithdrawalsQuery.gen';
import { useDeleteWithdrawalByWithdrawalIDMutation } from '@/shared/api/generated/hooks/withdrawal/useDeleteWithdrawalByWithdrawalIDMutation.gen';

export const useCancelWithdrawal = () => {
  const queryClient = useQueryClient();

  return useDeleteWithdrawalByWithdrawalIDMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getWithdrawalsQueryKey] });
        queryClient.invalidateQueries({ queryKey: [getBalanceQueryKey] });
      },
    },
  });
};
