'use client';

import '@/shared/api/instance';

import { Alert, Button, Card, Spinner, Table, Typography } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { InternalBrokerAccountDetailResponse } from '@/shared/api/generated/types.gen';

import { useMyAccounts } from '../hooks/useMyAccounts';
import { AccountStatusChip } from './AccountStatusChip';

interface BrokerAccountsTableProps {
  onAddAccount: () => void;
}

export const BrokerAccountsTable = ({ onAddAccount }: BrokerAccountsTableProps) => {
  const t = useTranslations('accounts');
  const locale = useLocale();
  const { data, isLoading, isError, refetch } = useMyAccounts();

  const accounts =
    (data?.data as { items?: InternalBrokerAccountDetailResponse[] } | undefined)?.items ?? [];

  if (isLoading) {
    return (
      <Card>
        <Card.Content className="flex items-center justify-center py-12">
          <Spinner />
        </Card.Content>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <Card.Content className="flex flex-col items-center gap-4 py-12 text-center">
          <Alert status="danger">
            <Alert.Content>
              <Alert.Description>{t('errors.loadFailed')}</Alert.Description>
            </Alert.Content>
          </Alert>
          <Button variant="secondary" onPress={() => refetch()}>
            {t('errors.retry')}
          </Button>
        </Card.Content>
      </Card>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card>
        <Card.Content className="flex flex-col items-center gap-4 py-12 text-center">
          <Typography.Heading className="text-lg">{t('noAccounts')}</Typography.Heading>
          <p className="text-muted">{t('noAccountsDesc')}</p>
          <Button onPress={onAddAccount}>{t('addAccount')}</Button>
        </Card.Content>
      </Card>
    );
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  });

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={t('title')}>
          <Table.Header>
            <Table.Column isRowHeader>{t('table.broker')}</Table.Column>
            <Table.Column>{t('table.uid')}</Table.Column>
            <Table.Column>{t('table.status')}</Table.Column>
            <Table.Column>{t('table.createdAt')}</Table.Column>
          </Table.Header>
          <Table.Body>
            {accounts.map((account) => (
              <Table.Row key={account.id}>
                <Table.Cell>{account.broker?.name ?? '—'}</Table.Cell>
                <Table.Cell>{account.uid ?? '—'}</Table.Cell>
                <Table.Cell>
                  <AccountStatusChip status={account.status ?? ''} />
                </Table.Cell>
                <Table.Cell>
                  {account.created_at ? dateFormatter.format(new Date(account.created_at)) : '—'}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
