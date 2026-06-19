import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getPayoutMethodsQueryKey } from "@/shared/api/generated/hooks/withdrawal/useGetPayoutMethodsQuery.gen";
import { usePatchPayoutMethodByMethodIDMutation } from "@/shared/api/generated/hooks/withdrawal/usePatchPayoutMethodByMethodIDMutation.gen";

export const useUpdatePayoutMethod = () => {
  const queryClient = useQueryClient();

  return usePatchPayoutMethodByMethodIDMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getPayoutMethodsQueryKey] });
      },
    },
  });
};
