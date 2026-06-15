import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { AuditLogTable } from '@/features/admin/components/audit/AuditLogTable';

export default async function AdminAuditLogPage() {
  const t = await getTranslations('admin.auditLog');

  return (
    <div className="flex flex-col gap-6">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <AuditLogTable />
    </div>
  );
}
