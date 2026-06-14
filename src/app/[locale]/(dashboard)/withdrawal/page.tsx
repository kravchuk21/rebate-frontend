import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { WithdrawalPageClient } from '@/features/withdrawal/components/WithdrawalPageClient';

export default async function WithdrawalPage() {
  const t = await getTranslations('withdrawal');

  return (
    <div className="flex flex-col gap-6 p-8">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <WithdrawalPageClient />
    </div>
  );
}
