import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';

import { AdminBrokerAccountsTable } from '@/features/admin/components/broker/AdminBrokerAccountsTable';

export default async function AdminBrokerAccountsPage() {
  const t = await getTranslations('admin.brokerAccounts');

  return (
    <>
      <PageHeader title={t('title')} />
      <AdminBrokerAccountsTable />
    </>
  );
}
