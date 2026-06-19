import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getBalanceQueryKey } from "@/shared/api/generated/hooks/withdrawal/useGetBalanceQuery.gen";
import { getWithdrawalsQueryKey } from "@/shared/api/generated/hooks/withdrawal/useGetWithdrawalsQuery.gen";
import { usePostWithdrawalsMutation } from "@/shared/api/generated/hooks/withdrawal/usePostWithdrawalsMutation.gen";

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return usePostWithdrawalsMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getWithdrawalsQueryKey] });
        queryClient.invalidateQueries({ queryKey: [getBalanceQueryKey] });
      },
    },
  });
};
