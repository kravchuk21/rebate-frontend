import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { AdminCalculationsTable } from '@/features/admin/components/rebate/AdminCalculationsTable';

export default async function AdminRebatePage() {
  const t = await getTranslations('admin.rebate');

  return (
    <div className="flex flex-col gap-6">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <AdminCalculationsTable />
    </div>
  );
}
