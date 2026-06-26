import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { referralProgramFlag } from "@/shared/flags";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";
import { ReferralLinkCard } from "@/features/referral/components/ReferralLinkCard";
import { ReferralsTable } from "@/features/referral/components/ReferralsTable";
import { ReferralStatsCard } from "@/features/referral/components/ReferralStatsCard";
import { ReferralStatsWidget } from "@/features/referral/components/ReferralStatsWidget";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

export default async function ReferralsPage() {
  if (!(await referralProgramFlag())) {
    notFound();
  }

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
          <ReferralStatsWidget fullMode={false} />
        </DashboardItem>

        <DashboardItem span={12}>
          <ReferralsTable />
        </DashboardItem>
      </DashboardLayout>
    </>
  );
}
