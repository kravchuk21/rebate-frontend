import "@/shared/api/instance";

import { useGetReferralsStatsQuery } from "@/shared/api/generated/hooks/referral/useGetReferralsStatsQuery.gen";

export const useReferralStats = () => useGetReferralsStatsQuery();
