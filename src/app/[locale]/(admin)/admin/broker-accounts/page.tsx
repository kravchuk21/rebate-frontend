import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { AdminBrokerAccountsTable } from '@/features/admin/components/broker/AdminBrokerAccountsTable';

export default async function AdminBrokerAccountsPage() {
  const t = await getTranslations('admin.brokerAccounts');

  return (
    <div className="flex flex-col gap-6">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <AdminBrokerAccountsTable />
    </div>
  );
}
