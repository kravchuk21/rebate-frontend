import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";
import { ReferralLinkCard } from "@/features/referral/components/ReferralLinkCard";
import { ReferralsTable } from "@/features/referral/components/ReferralsTable";
import { ReferralStatsCard } from "@/features/referral/components/ReferralStatsCard";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

export default async function ReferralsPage() {
  const t = await getTranslations("referrals");

  return (
    <>
      <PageHeader title={t("title")} />
      <DashboardLayout>
        <DashboardItem span={6}>
          <ReferralStatsCard />
        </DashboardItem>

        <DashboardItem span={6}>
          <ReferralLinkCard />
        </DashboardItem>

        <DashboardItem span={12}>
          <ReferralsTable />
        </DashboardItem>
      </DashboardLayout>
    </>
  );
}
