import "@/shared/api/instance";

import { useGetReferralsEarningsStatsQuery } from "@/shared/api/generated/hooks/referral/useGetReferralsEarningsStatsQuery.gen";

export const useReferralEarningsStats = () => useGetReferralsEarningsStatsQuery();
