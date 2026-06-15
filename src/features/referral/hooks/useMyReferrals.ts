import '@/shared/api/instance';

import { useGetReferralsQuery } from '@/shared/api/generated/hooks/referral/useGetReferralsQuery.gen';

export const useMyReferrals = (limit = 20, offset = 0) =>
  useGetReferralsQuery({ request: { query: { limit, offset } } });
