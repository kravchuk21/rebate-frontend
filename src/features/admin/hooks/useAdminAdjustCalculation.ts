import '@/shared/api/instance';

import { useQueryClient } from '@tanstack/react-query';

import { getRebateAdminCalculationsQueryKey } from '@/shared/api/generated/hooks/admin/useGetRebateAdminCalculationsQuery.gen';
import { usePostRebateAdminCalculationByCalculationIDAdjustMutation } from '@/shared/api/generated/hooks/admin/usePostRebateAdminCalculationByCalculationIDAdjustMutation.gen';

export const useAdminAdjustCalculation = () => {
  const queryClient = useQueryClient();

  return usePostRebateAdminCalculationByCalculationIDAdjustMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getRebateAdminCalculationsQueryKey] });
      },
    },
  });
};
