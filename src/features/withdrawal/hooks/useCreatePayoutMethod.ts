import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getPayoutMethodsQueryKey } from "@/shared/api/generated/hooks/withdrawal/useGetPayoutMethodsQuery.gen";
import { usePostPayoutMethodsMutation } from "@/shared/api/generated/hooks/withdrawal/usePostPayoutMethodsMutation.gen";

export const useCreatePayoutMethod = () => {
  const queryClient = useQueryClient();

  return usePostPayoutMethodsMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getPayoutMethodsQueryKey] });
      },
    },
  });
};
