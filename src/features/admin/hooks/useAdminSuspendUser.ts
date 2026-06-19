import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getAdminUsersQueryKey } from "@/shared/api/generated/hooks/admin/useGetAdminUsersQuery.gen";
import { usePostAdminUserByUserIDSuspendMutation } from "@/shared/api/generated/hooks/admin/usePostAdminUserByUserIDSuspendMutation.gen";

export const useAdminSuspendUser = () => {
  const queryClient = useQueryClient();

  return usePostAdminUserByUserIDSuspendMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getAdminUsersQueryKey] });
      },
    },
  });
};
