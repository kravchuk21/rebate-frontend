import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getPayoutMethodsQueryKey } from "@/shared/api/generated/hooks/withdrawal/useGetPayoutMethodsQuery.gen";
import { useDeletePayoutMethodByMethodIDMutation } from "@/shared/api/generated/hooks/withdrawal/useDeletePayoutMethodByMethodIDMutation.gen";

export const useDeletePayoutMethod = () => {
  const queryClient = useQueryClient();

  return useDeletePayoutMethodByMethodIDMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getPayoutMethodsQueryKey] });
      },
    },
  });
};
