import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getBrokerAdminAccountsQueryKey } from "@/shared/api/generated/hooks/admin/useGetBrokerAdminAccountsQuery.gen";
import { usePostBrokerAdminAccountByAccountIDApproveMutation } from "@/shared/api/generated/hooks/admin/usePostBrokerAdminAccountByAccountIDApproveMutation.gen";

export const useAdminApproveBrokerAccount = () => {
  const queryClient = useQueryClient();

  return usePostBrokerAdminAccountByAccountIDApproveMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getBrokerAdminAccountsQueryKey] });
      },
    },
  });
};
