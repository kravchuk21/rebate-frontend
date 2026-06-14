import '@/shared/api/instance';

import { useGetBrokerBrokersQuery } from '@/shared/api/generated/hooks/broker/useGetBrokerBrokersQuery.gen';

export const useBrokers = () => useGetBrokerBrokersQuery();
