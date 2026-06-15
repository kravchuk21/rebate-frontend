import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { SidebarToggle } from '@/shared/components/dashboard/SidebarToggle';
import { BrokerAccountsPageClient } from '@/features/broker/components/BrokerAccountsPageClient';

export default async function AccountsPage() {
  const t = await getTranslations('accounts');

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="flex items-center gap-4">
        <SidebarToggle/>
        <Typography type="h4">{t('title')}</Typography>
      </div>
      <BrokerAccountsPageClient />
    </div>
  );
}
