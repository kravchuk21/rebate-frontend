'use client';

import '@/shared/api/instance';

import { useState } from 'react';
import { Alert, Button, Card, Skeleton, Table, Tabs } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { WithdrawalResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';
import { truncateAddress } from '@/features/withdrawal/lib/validateAddress';
import { WithdrawalStatusChip } from '@/features/withdrawal/components/WithdrawalStatusChip';

import { useAdminWithdrawals } from '../../hooks/useAdminWithdrawals';
import { UpdateWithdrawalStatusModal } from './UpdateWithdrawalStatusModal';

const LIMIT = 20;

export const AdminWithdrawalsTable = () => {
  const t = useTranslations('admin.withdrawals');
  const locale = useLocale();
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [offset, setOffset] = useState(0);
  const [updateTarget, setUpdateTarget] = useState<string | null>(null);

  const { data, isLoading, isError } = useAdminWithdrawals({
    status: tab === 'pending' ? 'pending' : undefined,
    limit: LIMIT,
    offset,
  });

  const withdrawals = (data?.data as { items?: WithdrawalResponse[] } | undefined)?.items ?? [];

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleTabChange = (key: string) => {
    setTab(key === 'all' ? 'all' : 'pending');
    setOffset(0);
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs onSelectionChange={(key) => handleTabChange(String(key))}>
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id="pending">
              {t('tabs.pending')}
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="all">
              {t('tabs.all')}
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      {isError && (
        <Alert status="danger">
          <Alert.Content>
            <Alert.Description>{t('errors.loadFailed')}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {isLoading && (
        <Card>
          <Card.Content className="flex flex-col gap-3 py-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </Card.Content>
        </Card>
      )}

      {!isLoading && !isError && (
        <>
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label={t('title')}>
                <Table.Header>
                  <Table.Column isRowHeader>{t('columns.method')}</Table.Column>
                  <Table.Column>{t('columns.amount')}</Table.Column>
                  <Table.Column>{t('columns.toSend')}</Table.Column>
                  <Table.Column>{t('columns.status')}</Table.Column>
                  <Table.Column>{t('columns.requestedAt')}</Table.Column>
                  <Table.Column>{t('columns.txHash')}</Table.Column>
                  <Table.Column>{t('columns.actions')}</Table.Column>
                </Table.Header>
                <Table.Body>
                  {withdrawals.map((withdrawal) => (
                    <Table.Row key={withdrawal.id}>
                      <Table.Cell>
                        {withdrawal.payout_method
                          ? `${withdrawal.payout_method.name} (${withdrawal.payout_method.network})`
                          : '—'}
                      </Table.Cell>
                      <Table.Cell>{formatAmount(withdrawal.amount_requested)} USDT</Table.Cell>
                      <Table.Cell>
                        {withdrawal.amount_to_send != null
                          ? `${formatAmount(withdrawal.amount_to_send)} USDT`
                          : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        <WithdrawalStatusChip status={withdrawal.status ?? ''} />
                      </Table.Cell>
                      <Table.Cell>
                        {withdrawal.requested_at
                          ? dateFormatter.format(new Date(withdrawal.requested_at))
                          : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        {withdrawal.tx_hash ? truncateAddress(withdrawal.tx_hash) : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          variant="tertiary"
                          size="sm"
                          onPress={() => setUpdateTarget(withdrawal.id ?? null)}
                        >
                          {t('updateStatus.title')}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="tertiary"
              size="sm"
              isDisabled={offset === 0}
              onPress={() => setOffset(Math.max(0, offset - LIMIT))}
            >
              ←
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              isDisabled={withdrawals.length < LIMIT}
              onPress={() => setOffset(offset + LIMIT)}
            >
              →
            </Button>
          </div>
        </>
      )}

      <UpdateWithdrawalStatusModal
        withdrawalID={updateTarget}
        onOpenChange={(open) => !open && setUpdateTarget(null)}
      />
    </div>
  );
};
