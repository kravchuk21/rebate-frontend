import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getRebateAdminCalculationsQueryKey } from "@/shared/api/generated/hooks/admin/useGetRebateAdminCalculationsQuery.gen";
import { usePostRebateAdminImportMutation } from "@/shared/api/generated/hooks/admin/usePostRebateAdminImportMutation.gen";

export const useAdminImportBrokerData = () => {
  const queryClient = useQueryClient();

  return usePostRebateAdminImportMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getRebateAdminCalculationsQueryKey] });
      },
    },
  });
};
