import "@/shared/api/instance";

import { useGetBalanceQuery } from "@/shared/api/generated/hooks/withdrawal/useGetBalanceQuery.gen";

export const useBalance = () =>
  useGetBalanceQuery({
    params: {
      refetchInterval: 30_000,
    },
  });
