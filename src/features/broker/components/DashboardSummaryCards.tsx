'use client';

import '@/shared/api/instance';

import { Button, Card, Skeleton, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';
import type {
  BrokerAccountDetailResponse,
  ReferralStatsResponse,
  WithdrawalBalanceResponse,
} from '@/shared/api/generated/types.gen';
import { useBalance } from '@/features/withdrawal/hooks/useBalance';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';
import { useReferralStats } from '@/features/referral/hooks/useReferralStats';

import { useMyAccounts } from '../hooks/useMyAccounts';

export const DashboardSummaryCards = () => {
  const t = useTranslations('dashboard.cards');
  const router = useRouter();
  const { data } = useMyAccounts();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance();
  const { data: referralData, isLoading: isReferralLoading } = useReferralStats();

  const accounts =
    (data?.data as { items?: BrokerAccountDetailResponse[] } | undefined)?.items ?? [];
  const approvedCount = accounts.filter((account) => account.status === 'approved').length;

  const balance = balanceData?.data as WithdrawalBalanceResponse | undefined;
  const referralStats = referralData?.data as ReferralStatsResponse | undefined;

  return (
    <DashboardLayout>
      <DashboardItem span={4}>
        <Card variant="secondary">
          <Card.Header>
            <Card.Title>{t('accounts')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <Typography.Paragraph>
              {approvedCount}
            </Typography.Paragraph>
          </Card.Content>
          <Card.Footer>
            <Button variant="secondary" size="sm" onPress={() => router.push('/accounts')}>
              {t('manageAccounts')}
            </Button>
          </Card.Footer>
        </Card>
      </DashboardItem>

      <DashboardItem span={4}>
        <Card variant="secondary">
          <Card.Header>
            <Card.Title>{t('balance')}</Card.Title>
          </Card.Header>
          <Card.Content>
            {isBalanceLoading ? (
              <Skeleton className="h-7 w-full" />
            ) : (
              <Typography.Paragraph>
                {formatAmount(balance?.available)} USDT
              </Typography.Paragraph>
            )}
          </Card.Content>
          <Card.Footer>
            <Button variant="secondary" size="sm" onPress={() => router.push('/withdrawal')}>
              {t('withdrawFunds')}
            </Button>
          </Card.Footer>
        </Card>
      </DashboardItem>

      <DashboardItem span={4}>
        <Card variant="secondary">
          <Card.Header>
            <Card.Title>{t('referralCode')}</Card.Title>
          </Card.Header>
          <Card.Content>
            {isReferralLoading ? (
              <Skeleton className="h-7 w-full" />
            ) : (
              <Typography.Paragraph>
                {referralStats?.referral_code ?? '—'}
              </Typography.Paragraph>
            )}
          </Card.Content>
          <Card.Footer>
            <Button variant="secondary" size="sm" onPress={() => router.push('/referrals')}>
              {t('viewReferrals')}
            </Button>
          </Card.Footer>
        </Card>
      </DashboardItem>
    </DashboardLayout>
  );
};
