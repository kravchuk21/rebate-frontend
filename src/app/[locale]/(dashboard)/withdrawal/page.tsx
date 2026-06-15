import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { SidebarToggle } from '@/shared/components/dashboard/SidebarToggle';

import { WithdrawalPageClient } from '@/features/withdrawal/components/WithdrawalPageClient';

export default async function WithdrawalPage() {
  const t = await getTranslations('withdrawal');

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="flex items-center gap-4">
        <SidebarToggle/>
        <Typography type="h4">{t('title')}</Typography>
      </div>
      <WithdrawalPageClient />
    </div>
  );
}
