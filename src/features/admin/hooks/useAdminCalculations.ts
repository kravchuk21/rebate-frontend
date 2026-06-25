import "@/shared/api/instance";

import { keepPreviousData } from "@tanstack/react-query";

import { useGetRebateAdminCalculationsQuery } from "@/shared/api/generated/hooks/admin/useGetRebateAdminCalculationsQuery.gen";

export const useAdminCalculations = (params?: {
  broker_account_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}) =>
  useGetRebateAdminCalculationsQuery({
    request: { query: params },
    // Keep the current page on screen while the next page loads so the
    // pagination footer and rows don't flicker/unmount between offsets.
    params: { placeholderData: keepPreviousData },
  });
