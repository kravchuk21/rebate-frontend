import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/dashboard/PageHeader";

import { ConfigEditor } from "@/features/admin/components/config/ConfigEditor";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

export default async function AdminConfigPage() {
  const t = await getTranslations("admin.config");

  return (
    <>
      <PageHeader title={t("title")} />
      <DashboardLayout>
        <DashboardItem>
          <ConfigEditor />
        </DashboardItem>
      </DashboardLayout>
    </>
  );
}
