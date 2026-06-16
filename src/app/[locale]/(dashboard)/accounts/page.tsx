import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';
import { BrokerAccountsPageClient } from '@/features/broker/components/BrokerAccountsPageClient';

export default async function AccountsPage() {
  const t = await getTranslations('accounts');

  return (
    <>
      <PageHeader title={t('title')} />
      <BrokerAccountsPageClient />
    </>
  );
}
