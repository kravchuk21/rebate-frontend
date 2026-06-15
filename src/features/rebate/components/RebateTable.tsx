'use client';

import { useState } from 'react';
import { Alert, Button, Card, Skeleton, Table, Tooltip } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { RebateCalculationResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';

import { useMyCalculations } from '../hooks/useMyCalculations';
import { formatPeriodDate } from '../lib/formatPeriodDate';
import { RebateStatusChip } from './RebateStatusChip';

const LIMIT = 20;

export const RebateTable = () => {
  const t = useTranslations('rebate');
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isError } = useMyCalculations(LIMIT, offset);

  const items = (data?.data as { items?: RebateCalculationResponse[] } | undefined)?.items ?? [];

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

  if (items.length === 0 && offset === 0) {
    return (
      <Card>
        <Card.Content className="flex flex-col items-center justify-center gap-1 py-12 text-center">
          <p className="font-medium">{t('empty')}</p>
          <p className="text-sm text-muted">{t('emptyDesc')}</p>
        </Card.Content>
      </Card>
    );
  }

  const renderTooltipColumn = (label: string, tooltip: string) => (
    <Table.Column>
      <span className="flex items-center gap-1">
        {label}
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <span
              className="flex size-3.5 items-center justify-center rounded-full border border-muted text-[10px] text-muted"
              aria-label={tooltip}
              role="img"
            >
              i
            </span>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>{tooltip}</p>
          </Tooltip.Content>
        </Tooltip>
      </span>
    </Table.Column>
  );

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={t('title')}>
            <Table.Header>
              <Table.Column isRowHeader>{t('columns.broker')}</Table.Column>
              <Table.Column>{t('columns.uid')}</Table.Column>
              <Table.Column>{t('columns.period')}</Table.Column>
              <Table.Column>{t('columns.volume')}</Table.Column>
              {renderTooltipColumn(t('columns.grossRebate'), t('tooltips.grossRebate'))}
              {renderTooltipColumn(t('columns.ourFee'), t('tooltips.ourFee'))}
              {renderTooltipColumn(t('columns.referrerAmount'), t('tooltips.referrerAmount'))}
              {renderTooltipColumn(t('columns.yourPayout'), t('tooltips.yourPayout'))}
              <Table.Column>{t('columns.status')}</Table.Column>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.broker_account?.broker_name ?? '—'}</Table.Cell>
                  <Table.Cell>{item.broker_account?.uid ?? '—'}</Table.Cell>
                  <Table.Cell>{formatPeriodDate(item.period_date, locale)}</Table.Cell>
                  <Table.Cell>{formatAmount(item.broker_volume)}</Table.Cell>
                  <Table.Cell>{formatAmount(item.gross_rebate)} USDT</Table.Cell>
                  <Table.Cell>{formatAmount(item.our_fee_amount)} USDT</Table.Cell>
                  <Table.Cell>{formatAmount(item.referrer_amount)} USDT</Table.Cell>
                  <Table.Cell>{formatAmount(item.user_payout_amount)} USDT</Table.Cell>
                  <Table.Cell>
                    <RebateStatusChip status={item.status ?? ''} />
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
