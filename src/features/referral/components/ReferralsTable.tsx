'use client';

import { useState } from 'react';
import { Alert, Button, Card, Chip, Skeleton, Table, Typography } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { ReferralEntryResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';

import { useMyReferrals } from '../hooks/useMyReferrals';

const LIMIT = 20;

const statusColorMap: Record<string, 'success' | 'danger' | 'default'> = {
  active: 'success',
  suspended: 'danger',
};

export const ReferralsTable = () => {
  const t = useTranslations('referrals.table');
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isError } = useMyReferrals(LIMIT, offset);

  const items = (data?.data as { items?: ReferralEntryResponse[] } | undefined)?.items ?? [];

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
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
      <Card variant="secondary">
        <Card.Content className="flex flex-col gap-3 py-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </Card.Content>
      </Card>
    );
  }

  if (items.length === 0 && offset === 0) {
    return (
      <Card variant="secondary">
        <Card.Header>
          <Card.Title>{t('title')}</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col items-center justify-center py-12 text-center">
          <Typography.Paragraph>{t('empty')}</Typography.Paragraph>
          <Typography.Paragraph size="sm" color="muted">{t('emptyDesc')}</Typography.Paragraph>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={t('title')}>
            <Table.Header>
              <Table.Column isRowHeader>{t('columns.email')}</Table.Column>
              <Table.Column>{t('columns.joinedAt')}</Table.Column>
              <Table.Column>{t('columns.status')}</Table.Column>
              <Table.Column>{t('columns.earned')}</Table.Column>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.user_id}>
                  <Table.Cell>{item.email ?? '—'}</Table.Cell>
                  <Table.Cell>
                    {item.joined_at ? dateFormatter.format(new Date(item.joined_at)) : '—'}
                  </Table.Cell>
                  <Table.Cell>
                    <Chip color={statusColorMap[item.status ?? ''] ?? 'default'}>
                      {item.status ?? '—'}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>{formatAmount(item.total_earned)} USDT</Table.Cell>
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
          {t('pagination.prev')}
        </Button>
        <Button
          variant="tertiary"
          size="sm"
          isDisabled={items.length < LIMIT}
          onPress={() => setOffset(offset + LIMIT)}
        >
          {t('pagination.next')}
        </Button>
      </div>
    </div>
  );
};
