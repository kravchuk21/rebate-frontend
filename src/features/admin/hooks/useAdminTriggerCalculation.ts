import '@/shared/api/instance';

import { useQueryClient } from '@tanstack/react-query';

import { getRebateAdminCalculationsQueryKey } from '@/shared/api/generated/hooks/admin/useGetRebateAdminCalculationsQuery.gen';
import { usePostRebateAdminTriggerMutation } from '@/shared/api/generated/hooks/admin/usePostRebateAdminTriggerMutation.gen';

export const useAdminTriggerCalculation = () => {
  const queryClient = useQueryClient();

  return usePostRebateAdminTriggerMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getRebateAdminCalculationsQueryKey] });
      },
    },
  });
};
