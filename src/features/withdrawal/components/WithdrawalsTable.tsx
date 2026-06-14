'use client';

import '@/shared/api/instance';

import { useState } from 'react';
import { AlertDialog, Alert, Button, Card, Skeleton, Table } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import type { WithdrawalResponse } from '@/shared/api/generated/types.gen';

import { useCancelWithdrawal } from '../hooks/useCancelWithdrawal';
import { useWithdrawals } from '../hooks/useWithdrawals';
import { formatAmount } from '../lib/formatAmount';
import { truncateAddress } from '../lib/validateAddress';
import { WithdrawalStatusChip } from './WithdrawalStatusChip';

export const WithdrawalsTable = () => {
  const t = useTranslations('withdrawal.history');
  const locale = useLocale();
  const { data, isLoading, isError } = useWithdrawals(20, 0);
  const cancelWithdrawal = useCancelWithdrawal();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const withdrawals =
    (data?.data as { items?: WithdrawalResponse[] } | undefined)?.items ?? [];

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (isError) {
    return (
      <Alert status="danger">
        <Alert.Content>
          <Alert.Description>{t('errors.loadFailed')}</Alert.Description>
        </Alert.Content>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <Card.Content className="flex flex-col gap-3 py-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </Card.Content>
      </Card>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <Card>
        <Card.Content className="flex items-center justify-center py-12 text-center text-muted">
          {t('empty')}
        </Card.Content>
      </Card>
    );
  }

  const handleCancel = (id: string) => {
    cancelWithdrawal.mutate(
      { path: { withdrawalID: id } },
      {
        onSuccess: () => setCancelTarget(null),
      },
    );
  };

  return (
    <>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={t('title')}>
            <Table.Header>
              <Table.Column isRowHeader>{t('columns.method')}</Table.Column>
              <Table.Column>{t('columns.amount')}</Table.Column>
              <Table.Column>{t('columns.fee')}</Table.Column>
              <Table.Column>{t('columns.youReceive')}</Table.Column>
              <Table.Column>{t('columns.status')}</Table.Column>
              <Table.Column>{t('columns.date')}</Table.Column>
              <Table.Column>{t('columns.txHash')}</Table.Column>
              <Table.Column>{t('cancel')}</Table.Column>
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
                    {withdrawal.network_fee != null ? `${formatAmount(withdrawal.network_fee)} USDT` : '—'}
                  </Table.Cell>
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
                    {withdrawal.status === 'pending' && withdrawal.id && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        onPress={() => setCancelTarget(withdrawal.id ?? null)}
                      >
                        {t('cancel')}
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <AlertDialog isOpen={cancelTarget !== null} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>{t('cancelConfirm')}</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body className="flex flex-col gap-3">
                {cancelWithdrawal.isError && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>
                        {getErrorMessage(cancelWithdrawal.error) ?? t('errors.cancelFailed')}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="tertiary" slot="close">
                  {t('cancel')}
                </Button>
                <Button
                  variant="primary"
                  onPress={() => cancelTarget && handleCancel(cancelTarget)}
                  isDisabled={cancelWithdrawal.isPending}
                >
                  {t('cancel')}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </>
  );
};
