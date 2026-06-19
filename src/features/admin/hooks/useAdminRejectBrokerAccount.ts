import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getBrokerAdminAccountsQueryKey } from "@/shared/api/generated/hooks/admin/useGetBrokerAdminAccountsQuery.gen";
import { usePostBrokerAdminAccountByAccountIDRejectMutation } from "@/shared/api/generated/hooks/admin/usePostBrokerAdminAccountByAccountIDRejectMutation.gen";

export const useAdminRejectBrokerAccount = () => {
  const queryClient = useQueryClient();

  return usePostBrokerAdminAccountByAccountIDRejectMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getBrokerAdminAccountsQueryKey] });
      },
    },
  });
};
