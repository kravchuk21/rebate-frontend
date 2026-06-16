import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';

import { RebateTable } from '@/features/rebate/components/RebateTable';

export default async function RebatePage() {
  const t = await getTranslations('rebate');

  return (
    <>
      <PageHeader title={t('title')} />
      <RebateTable />
    </>
  );
}
