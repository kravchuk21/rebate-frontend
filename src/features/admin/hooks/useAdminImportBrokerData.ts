import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getRebateAdminCalculationsQueryKey } from "@/shared/api/generated/hooks/admin/useGetRebateAdminCalculationsQuery.gen";
import { usePostRebateAdminImportBatchMutation } from "@/shared/api/generated/hooks/admin/usePostRebateAdminImportBatchMutation.gen";

export const useAdminImportBrokerData = () => {
  const queryClient = useQueryClient();

  return usePostRebateAdminImportBatchMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getRebateAdminCalculationsQueryKey] });
      },
    },
  });
};
