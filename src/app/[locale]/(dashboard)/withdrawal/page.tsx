import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';

import { WithdrawalPageClient } from '@/features/withdrawal/components/WithdrawalPageClient';

export default async function WithdrawalPage() {
  const t = await getTranslations('withdrawal');

  return (
    <>
      <PageHeader title={t('title')} />
      <WithdrawalPageClient />
    </>
  );
}
