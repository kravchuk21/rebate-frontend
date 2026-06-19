import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getAdminWithdrawalsQueryKey } from "@/shared/api/generated/hooks/admin/useGetAdminWithdrawalsQuery.gen";
import { usePatchAdminWithdrawalByWithdrawalIDStatusMutation } from "@/shared/api/generated/hooks/admin/usePatchAdminWithdrawalByWithdrawalIDStatusMutation.gen";

export const useAdminUpdateWithdrawalStatus = () => {
  const queryClient = useQueryClient();

  return usePatchAdminWithdrawalByWithdrawalIDStatusMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getAdminWithdrawalsQueryKey] });
      },
    },
  });
};
