import '@/shared/api/instance';

import { useQueryClient } from '@tanstack/react-query';

import { getBrokerAdminAccountsQueryKey } from '@/shared/api/generated/hooks/admin/useGetBrokerAdminAccountsQuery.gen';
import { usePostBrokerAdminAccountByAccountIDRevokeMutation } from '@/shared/api/generated/hooks/admin/usePostBrokerAdminAccountByAccountIDRevokeMutation.gen';

export const useAdminRevokeBrokerAccount = () => {
  const queryClient = useQueryClient();

  return usePostBrokerAdminAccountByAccountIDRevokeMutation({
    params: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [getBrokerAdminAccountsQueryKey] });
      },
    },
  });
};
