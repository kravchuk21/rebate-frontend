import "@/shared/api/instance";

import { useGetBrokerAdminAccountsQuery } from "@/shared/api/generated/hooks/admin/useGetBrokerAdminAccountsQuery.gen";

export const useAdminBrokerAccounts = (params?: {
  status?: string;
  broker_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) => useGetBrokerAdminAccountsQuery({ request: { query: params } });
