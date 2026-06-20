import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";

import { DashboardSummaryCards } from "@/features/broker/components/DashboardSummaryCards";
import { ReferralLinkCard } from "@/features/referral/components/ReferralLinkCard";
import { RebateStatsWidget } from "@/features/rebate/components/RebateStatsWidget";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { ReferralStatsWidget } from "@/features/referral/components/ReferralStatsWidget";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <>
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
    </>
  );
}
