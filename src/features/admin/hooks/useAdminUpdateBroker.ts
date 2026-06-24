import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getBrokerBrokersQueryKey } from "@/shared/api/generated/hooks/broker/useGetBrokerBrokersQuery.gen";
import { usePutBrokerAdminBrokerByBrokerIDMutation } from "@/shared/api/generated/hooks/admin/usePutBrokerAdminBrokerByBrokerIDMutation.gen";

export const useAdminUpdateBroker = () => {
  const queryClient = useQueryClient();

  return usePutBrokerAdminBrokerByBrokerIDMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getBrokerBrokersQueryKey] });
      },
    },
  });
};
