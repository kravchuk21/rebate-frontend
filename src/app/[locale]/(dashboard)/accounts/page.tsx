import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { BrokerAccountsPageClient } from '@/features/broker/components/BrokerAccountsPageClient';

export default async function AccountsPage() {
  const t = await getTranslations('accounts');

  return (
    <div className="flex flex-col gap-6 p-8">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <BrokerAccountsPageClient />
    </div>
  );
}
