import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getBrokerBrokersQueryKey } from "@/shared/api/generated/hooks/broker/useGetBrokerBrokersQuery.gen";
import { useDeleteBrokerAdminBrokerByBrokerIDMutation } from "@/shared/api/generated/hooks/admin/useDeleteBrokerAdminBrokerByBrokerIDMutation.gen";

export const useAdminDeleteBroker = () => {
  const queryClient = useQueryClient();

  return useDeleteBrokerAdminBrokerByBrokerIDMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getBrokerBrokersQueryKey] });
      },
    },
  });
};
