'use client';

import '@/shared/api/instance';

import { Card, Skeleton } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
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
  const { data } = useMyAccounts();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance();
  const { data: referralData, isLoading: isReferralLoading } = useReferralStats();

  const accounts =
    (data?.data as { items?: BrokerAccountDetailResponse[] } | undefined)?.items ?? [];
  const approvedCount = accounts.filter((account) => account.status === 'approved').length;

  const balance = balanceData?.data as WithdrawalBalanceResponse | undefined;
  const referralStats = referralData?.data as ReferralStatsResponse | undefined;

  const handleCopyReferralLink = () => {
    if (!referralStats?.referral_url) return;
    navigator.clipboard.writeText(referralStats.referral_url);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Link href="/accounts">
        <Card variant='secondary'>
          <Card.Header>
            <Card.Title>{t('accounts')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <span className="text-2xl font-semibold">{approvedCount}</span>
          </Card.Content>
        </Card>
      </Link>

      <Link href="/withdrawal">
        <Card>
          <Card.Header>
            <Card.Title>{t('balance')}</Card.Title>
          </Card.Header>
          <Card.Content>
            {isBalanceLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <span className="text-2xl font-semibold">
                {formatAmount(balance?.available)} USDT
              </span>
            )}
          </Card.Content>
        </Card>
      </Link>

      <Link href="/referrals">
        <Card>
          <Card.Header>
            <Card.Title>{t('referralCode')}</Card.Title>
          </Card.Header>
          <Card.Content>
            {isReferralLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <button
                type="button"
                className="text-2xl font-semibold"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCopyReferralLink();
                }}
              >
                {referralStats?.referral_code ?? '—'}
              </button>
            )}
          </Card.Content>
        </Card>
      </Link>
    </div>
  );
};
