import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { RebateTable } from "@/features/rebate/components/RebateTable";
import { RebateStatsWidget } from "@/features/rebate/components/RebateStatsWidget";
import { RebateSummaryTable } from "@/features/rebate/components/RebateSummaryTable";

export default async function RebatePage() {
  const t = await getTranslations("rebate");

  return (
    <>
      <PageHeader title={t("title")} />
      <DashboardLayout>
        <DashboardItem span={6}>
          <RebateSummaryTable />
        </DashboardItem>
        <DashboardItem span={6}>
          <RebateStatsWidget fullMode={false} />
        </DashboardItem>
        <DashboardItem>
          <RebateTable />
        </DashboardItem>
      </DashboardLayout>
    </>
  );
}
