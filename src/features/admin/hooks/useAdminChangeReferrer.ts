import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getAdminUsersQueryKey } from "@/shared/api/generated/hooks/admin/useGetAdminUsersQuery.gen";
import { usePutAdminUserByUserIDReferrerMutation } from "@/shared/api/generated/hooks/admin/usePutAdminUserByUserIDReferrerMutation.gen";

export const useAdminChangeReferrer = () => {
  const queryClient = useQueryClient();

  return usePutAdminUserByUserIDReferrerMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getAdminUsersQueryKey] });
      },
    },
  });
};
