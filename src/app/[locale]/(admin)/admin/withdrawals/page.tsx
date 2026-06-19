import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";

import { AdminWithdrawalsTable } from "@/features/admin/components/withdrawals/AdminWithdrawalsTable";

export default async function AdminWithdrawalsPage() {
  const t = await getTranslations("admin.withdrawals");

  return (
    <>
      <PageHeader title={t("title")} />
      <AdminWithdrawalsTable />
    </>
  );
}
