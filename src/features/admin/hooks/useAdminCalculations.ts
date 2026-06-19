import "@/shared/api/instance";

import { useGetRebateAdminCalculationsQuery } from "@/shared/api/generated/hooks/admin/useGetRebateAdminCalculationsQuery.gen";

export const useAdminCalculations = (params?: {
  broker_account_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}) => useGetRebateAdminCalculationsQuery({ request: { query: params } });
