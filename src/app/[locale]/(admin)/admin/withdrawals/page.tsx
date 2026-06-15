import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { AdminWithdrawalsTable } from '@/features/admin/components/withdrawals/AdminWithdrawalsTable';

export default async function AdminWithdrawalsPage() {
  const t = await getTranslations('admin.withdrawals');

  return (
    <div className="flex flex-col gap-6">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <AdminWithdrawalsTable />
    </div>
  );
}
