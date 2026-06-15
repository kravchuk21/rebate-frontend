import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { RebateTable } from '@/features/rebate/components/RebateTable';

export default async function RebatePage() {
  const t = await getTranslations('rebate');

  return (
    <div className="flex flex-col gap-6 p-8">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <RebateTable />
    </div>
  );
}
