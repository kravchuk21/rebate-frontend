import "@/shared/api/instance";

import { useGetWithdrawalsQuery } from "@/shared/api/generated/hooks/withdrawal/useGetWithdrawalsQuery.gen";

export const useWithdrawals = (limit = 20, offset = 0) =>
  useGetWithdrawalsQuery({ request: { query: { limit, offset } } });
