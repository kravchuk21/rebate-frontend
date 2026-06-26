import { getTranslations } from "next-intl/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";

import { DashboardSummaryCards } from "@/features/broker/components/DashboardSummaryCards";
import { ReferralLinkCard } from "@/features/referral/components/ReferralLinkCard";
import { RebateStatsWidget } from "@/features/rebate/components/RebateStatsWidget";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { ReferralStatsWidget } from "@/features/referral/components/ReferralStatsWidget";
import { prefetchAuthed } from "@/shared/api/server-prefetch";
import { getBrokerAccountsQueryOptions } from "@/shared/api/generated/hooks/broker/useGetBrokerAccountsQuery.gen";
import { getBalanceQueryOptions } from "@/shared/api/generated/hooks/withdrawal/useGetBalanceQuery.gen";
import { getReferralsStatsQueryOptions } from "@/shared/api/generated/hooks/referral/useGetReferralsStatsQuery.gen";
import { getRebateStatsQueryOptions } from "@/shared/api/generated/hooks/rebate/useGetRebateStatsQuery.gen";
import { getReferralsEarningsStatsQueryOptions } from "@/shared/api/generated/hooks/referral/useGetReferralsEarningsStatsQuery.gen";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  // Seed the cache server-side so the widgets' client hooks hydrate on first
  // paint instead of firing a fetch waterfall after hydration. Keys match the
  // no-arg hooks (`config`/headers are excluded from the key). A failed prefetch
  // degrades gracefully to the existing client fetch.
  const state = await prefetchAuthed((request) => [
    getBrokerAccountsQueryOptions({ request }),
    getBalanceQueryOptions({ request }),
    getReferralsStatsQueryOptions({ request }),
    getRebateStatsQueryOptions({ request }),
    getReferralsEarningsStatsQueryOptions({ request }),
  ]);

  return (
    <HydrationBoundary state={state}>
      <PageHeader title={t("title")} />
      <DashboardLayout>
        <DashboardItem>
          <DashboardSummaryCards />
        </DashboardItem>
        <DashboardItem>
          <ReferralLinkCard />
        </DashboardItem>
        <DashboardItem span={6}>
          <RebateStatsWidget />
        </DashboardItem>
        <DashboardItem span={6}>
          <ReferralStatsWidget />
        </DashboardItem>
      </DashboardLayout>
    </HydrationBoundary>
  );
}
