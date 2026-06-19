import "@/shared/api/instance";

import { useGetAdminWithdrawalsQuery } from "@/shared/api/generated/hooks/admin/useGetAdminWithdrawalsQuery.gen";

export const useAdminWithdrawals = (params?: {
  status?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}) => useGetAdminWithdrawalsQuery({ request: { query: params } });
