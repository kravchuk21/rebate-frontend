import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";

import { DashboardSummaryCards } from "@/features/broker/components/DashboardSummaryCards";
import { RebateStatsWidget } from "@/features/rebate/components/RebateStatsWidget";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { ReferralStatsWidget } from "@/features/referral/components/ReferralStatsWidget";
import { OnboardingWidget } from "@/features/onboarding/components/OnboardingWidget";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  // No server-side prefetch here: the widgets' client hooks read from the
  // persistent client QueryClient cache, which survives soft navigations (the
  // `staleTime` in QueryProvider keeps it fresh). Prefetching on the server
  // blocked every navigation on a fetch waterfall and triggered the route-level
  // skeleton each time; instead each widget renders its own skeleton on the
  // rare cache miss (first load), matching the rest of the dashboard pages.
  return (
    <>
      <PageHeader title={t("title")} />
      <DashboardLayout>
        <DashboardItem>
          <OnboardingWidget />
        </DashboardItem>
        <DashboardItem>
          <DashboardSummaryCards />
        </DashboardItem>
        <DashboardItem span={6}>
          <RebateStatsWidget />
        </DashboardItem>
        <DashboardItem span={6}>
          <ReferralStatsWidget />
        </DashboardItem>
      </DashboardLayout>
    </>
  );
}
