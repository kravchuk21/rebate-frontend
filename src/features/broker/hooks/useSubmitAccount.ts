import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { usePostBrokerAccountsMutation } from "@/shared/api/generated/hooks/broker/usePostBrokerAccountsMutation.gen";
import { getBrokerAccountsQueryKey } from "@/shared/api/generated/hooks/broker/useGetBrokerAccountsQuery.gen";

export const useSubmitAccount = () => {
  const queryClient = useQueryClient();

  return usePostBrokerAccountsMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getBrokerAccountsQueryKey] });
      },
    },
  });
};
