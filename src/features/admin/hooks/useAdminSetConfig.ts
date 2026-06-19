import "@/shared/api/instance";

import { useQueryClient } from "@tanstack/react-query";

import { getAdminConfigQueryKey } from "@/shared/api/generated/hooks/admin/useGetAdminConfigQuery.gen";
import { usePutAdminConfigByKeyMutation } from "@/shared/api/generated/hooks/admin/usePutAdminConfigByKeyMutation.gen";

export const useAdminSetConfig = () => {
  const queryClient = useQueryClient();

  return usePutAdminConfigByKeyMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getAdminConfigQueryKey] });
      },
    },
  });
};
