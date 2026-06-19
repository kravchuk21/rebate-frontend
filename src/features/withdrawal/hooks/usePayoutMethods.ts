import "@/shared/api/instance";

import { useGetPayoutMethodsQuery } from "@/shared/api/generated/hooks/withdrawal/useGetPayoutMethodsQuery.gen";

export const usePayoutMethods = () => useGetPayoutMethodsQuery();
