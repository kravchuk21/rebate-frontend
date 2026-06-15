import '@/shared/api/instance';

import { useGetRebateCalculationsQuery } from '@/shared/api/generated/hooks/rebate/useGetRebateCalculationsQuery.gen';

export const useMyCalculations = (limit = 20, offset = 0) =>
  useGetRebateCalculationsQuery({ request: { query: { limit, offset } } });
