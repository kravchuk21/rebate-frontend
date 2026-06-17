import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';

import { AuditLogTable } from '@/features/admin/components/audit/AuditLogTable';

export default async function AdminAuditLogPage() {
  const t = await getTranslations('admin.auditLog');

  return (
    <>
      <PageHeader title={t('title')} />
      <AuditLogTable />
    </>
  );
}
