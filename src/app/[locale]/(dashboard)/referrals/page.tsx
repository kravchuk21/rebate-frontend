import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';
import { ReferralLinkCard } from '@/features/referral/components/ReferralLinkCard';
import { ReferralsTable } from '@/features/referral/components/ReferralsTable';
import { ReferralStatsCard } from '@/features/referral/components/ReferralStatsCard';

export default async function ReferralsPage() {
  const t = await getTranslations('referrals');

  return (
    <>
      <PageHeader title={t('title')} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReferralStatsCard />
        <ReferralLinkCard />
      </div>
      <ReferralsTable />
    </>
  );
}
