import "@/shared/api/instance";

import { useGetBalanceLedgerQuery } from "@/shared/api/generated/hooks/withdrawal/useGetBalanceLedgerQuery.gen";

export const useLedger = (limit = 10, offset = 0) =>
  useGetBalanceLedgerQuery({ request: { query: { limit, offset } } });
