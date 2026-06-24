import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";

import { AdminBrokersTable } from "@/features/admin/components/brokers/AdminBrokersTable";

export default async function AdminBrokersPage() {
  const t = await getTranslations("admin.brokers");

  return (
    <>
      <PageHeader title={t("title")} />
      <AdminBrokersTable />
    </>
  );
}
