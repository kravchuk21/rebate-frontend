import '@/shared/api/instance';

import { useQueryClient } from '@tanstack/react-query';

import { getAdminUsersQueryKey } from '@/shared/api/generated/hooks/admin/useGetAdminUsersQuery.gen';
import { usePostAdminUserByUserIDBalanceAdjustMutation } from '@/shared/api/generated/hooks/admin/usePostAdminUserByUserIDBalanceAdjustMutation.gen';

export const useAdminAdjustBalance = () => {
  const queryClient = useQueryClient();

  return usePostAdminUserByUserIDBalanceAdjustMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getAdminUsersQueryKey] });
      },
    },
  });
};
