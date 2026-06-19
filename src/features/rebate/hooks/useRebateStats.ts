import '@/shared/api/instance';

import { useGetRebateStatsQuery } from '@/shared/api/generated/hooks/rebate/useGetRebateStatsQuery.gen';

export const useRebateStats = () => useGetRebateStatsQuery();
