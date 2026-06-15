import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { ReferralLinkCard } from '@/features/referral/components/ReferralLinkCard';
import { ReferralsTable } from '@/features/referral/components/ReferralsTable';
import { ReferralStatsCard } from '@/features/referral/components/ReferralStatsCard';

export default async function ReferralsPage() {
  const t = await getTranslations('referrals');

  return (
    <div className="flex flex-col gap-6 p-8">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReferralStatsCard />
        <ReferralLinkCard />
      </div>
      <ReferralsTable />
    </div>
  );
}
