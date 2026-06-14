'use client';

import '@/shared/api/instance';

import { Alert, Card, Skeleton, Table } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { WithdrawalLedgerEntryResponse } from '@/shared/api/generated/types.gen';

import { useLedger } from '../hooks/useLedger';
import { formatAmountWithSign } from '../lib/formatAmount';
import { LedgerTypeChip } from './LedgerTypeChip';

interface LedgerTableProps {
  limit?: number;
}

export const LedgerTable = ({ limit = 10 }: LedgerTableProps) => {
  const t = useTranslations('withdrawal.ledger');
  const locale = useLocale();
  const { data, isLoading, isError } = useLedger(limit, 0);

  const entries = (data?.data as { items?: WithdrawalLedgerEntryResponse[] } | undefined)?.items ?? [];

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

  if (entries.length === 0) {
    return (
      <Card>
        <Card.Content className="flex items-center justify-center py-12 text-center text-muted">
          {t('empty')}
        </Card.Content>
      </Card>
    );
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={t('title')}>
          <Table.Header>
            <Table.Column isRowHeader>{t('columns.type')}</Table.Column>
            <Table.Column>{t('columns.amount')}</Table.Column>
            <Table.Column>{t('columns.date')}</Table.Column>
          </Table.Header>
          <Table.Body>
            {entries.map((entry) => {
              const { text, isPositive } = formatAmountWithSign(entry.amount);

              return (
                <Table.Row key={entry.id}>
                  <Table.Cell>
                    <LedgerTypeChip type={entry.type ?? ''} />
                  </Table.Cell>
                  <Table.Cell>
                    <span className={isPositive ? 'text-success' : 'text-danger'}>
                      {text} USDT
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {entry.created_at ? dateFormatter.format(new Date(entry.created_at)) : '—'}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
