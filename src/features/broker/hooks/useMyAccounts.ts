import "@/shared/api/instance";

import { useGetBrokerAccountsQuery } from "@/shared/api/generated/hooks/broker/useGetBrokerAccountsQuery.gen";

export const useMyAccounts = () => useGetBrokerAccountsQuery();
