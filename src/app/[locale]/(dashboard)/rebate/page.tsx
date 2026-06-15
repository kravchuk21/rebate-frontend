import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { SidebarToggle } from '@/shared/components/dashboard/SidebarToggle';

import { RebateTable } from '@/features/rebate/components/RebateTable';

export default async function RebatePage() {
  const t = await getTranslations('rebate');

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="flex items-center gap-4">
        <SidebarToggle/>
        <Typography type="h4">{t('title')}</Typography>
      </div>
      <RebateTable />
    </div>
  );
}
