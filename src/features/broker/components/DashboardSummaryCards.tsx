'use client';

import '@/shared/api/instance';

import { Card, Skeleton } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import type {
  BrokerAccountDetailResponse,
  WithdrawalBalanceResponse,
} from '@/shared/api/generated/types.gen';
import { useBalance } from '@/features/withdrawal/hooks/useBalance';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';

import { useMyAccounts } from '../hooks/useMyAccounts';

export const DashboardSummaryCards = () => {
  const t = useTranslations('dashboard.cards');
  const { data } = useMyAccounts();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance();

  const accounts =
    (data?.data as { items?: BrokerAccountDetailResponse[] } | undefined)?.items ?? [];
  const approvedCount = accounts.filter((account) => account.status === 'approved').length;

  const balance = balanceData?.data as WithdrawalBalanceResponse | undefined;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Link href="/accounts">
        <Card>
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

      <Card>
        <Card.Header>
          <Card.Title>{t('referralCode')}</Card.Title>
        </Card.Header>
        <Card.Content>
          <span className="text-2xl font-semibold">—</span>
        </Card.Content>
      </Card>
    </div>
  );
};
