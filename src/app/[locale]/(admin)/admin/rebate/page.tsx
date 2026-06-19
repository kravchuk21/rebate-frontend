import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";

import { AdminCalculationsTable } from "@/features/admin/components/rebate/AdminCalculationsTable";

export default async function AdminRebatePage() {
  const t = await getTranslations("admin.rebate");

  return (
    <>
      <PageHeader title={t("title")} />
      <AdminCalculationsTable />
    </>
  );
}
