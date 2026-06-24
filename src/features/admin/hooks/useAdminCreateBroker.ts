import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getBrokerBrokersQueryKey } from "@/shared/api/generated/hooks/broker/useGetBrokerBrokersQuery.gen";
import { usePostBrokerAdminBrokersMutation } from "@/shared/api/generated/hooks/admin/usePostBrokerAdminBrokersMutation.gen";

export const useAdminCreateBroker = () => {
  const queryClient = useQueryClient();

  return usePostBrokerAdminBrokersMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getBrokerBrokersQueryKey] });
      },
    },
  });
};
