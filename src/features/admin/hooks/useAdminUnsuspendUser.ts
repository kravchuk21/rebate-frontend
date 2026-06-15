import '@/shared/api/instance';

import { useQueryClient } from '@tanstack/react-query';

import { getAdminUsersQueryKey } from '@/shared/api/generated/hooks/admin/useGetAdminUsersQuery.gen';
import { usePostAdminUserByUserIDUnsuspendMutation } from '@/shared/api/generated/hooks/admin/usePostAdminUserByUserIDUnsuspendMutation.gen';

export const useAdminUnsuspendUser = () => {
  const queryClient = useQueryClient();

  return usePostAdminUserByUserIDUnsuspendMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getAdminUsersQueryKey] });
      },
    },
  });
};
