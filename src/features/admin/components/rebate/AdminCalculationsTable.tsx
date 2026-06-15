'use client';

import '@/shared/api/instance';

import { useState } from 'react';
import { Alert, Button, Card, Skeleton, Table } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { RebateCalculationResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';
import { RebateStatusChip } from '@/features/rebate/components/RebateStatusChip';
import { formatPeriodDate } from '@/features/rebate/lib/formatPeriodDate';

import { useAdminCalculations } from '../../hooks/useAdminCalculations';
import { AdjustCalculationModal } from './AdjustCalculationModal';
import { ImportBrokerDataModal } from './ImportBrokerDataModal';
import { TriggerCalculationModal } from './TriggerCalculationModal';

const LIMIT = 20;

export const AdminCalculationsTable = () => {
  const t = useTranslations('admin.rebate');
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<RebateCalculationResponse | null>(null);

  const { data, isLoading, isError } = useAdminCalculations({ limit: LIMIT, offset });

  const calculations =
    (data?.data as { items?: RebateCalculationResponse[] } | undefined)?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onPress={() => setIsImportOpen(true)}>
          {t('import.title')}
        </Button>
        <Button variant="outline" onPress={() => setIsTriggerOpen(true)}>
          {t('trigger.title')}
        </Button>
      </div>

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
                  <Table.Column isRowHeader>{t('columns.broker')}</Table.Column>
                  <Table.Column>{t('columns.uid')}</Table.Column>
                  <Table.Column>{t('columns.period')}</Table.Column>
                  <Table.Column>{t('columns.grossRebate')}</Table.Column>
                  <Table.Column>{t('columns.payout')}</Table.Column>
                  <Table.Column>{t('columns.status')}</Table.Column>
                  <Table.Column>{t('columns.actions')}</Table.Column>
                </Table.Header>
                <Table.Body>
                  {calculations.map((calculation) => (
                    <Table.Row key={calculation.id}>
                      <Table.Cell>{calculation.broker_account?.broker_name ?? '—'}</Table.Cell>
                      <Table.Cell>{calculation.broker_account?.uid ?? '—'}</Table.Cell>
                      <Table.Cell>{formatPeriodDate(calculation.period_date, locale)}</Table.Cell>
                      <Table.Cell>{formatAmount(calculation.gross_rebate)} USDT</Table.Cell>
                      <Table.Cell>{formatAmount(calculation.user_payout_amount)} USDT</Table.Cell>
                      <Table.Cell>
                        <RebateStatusChip status={calculation.status ?? ''} />
                      </Table.Cell>
                      <Table.Cell>
                        <Button variant="tertiary" size="sm" onPress={() => setAdjustTarget(calculation)}>
                          {t('adjust.title')}
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
              isDisabled={calculations.length < LIMIT}
              onPress={() => setOffset(offset + LIMIT)}
            >
              →
            </Button>
          </div>
        </>
      )}

      <ImportBrokerDataModal isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
      <TriggerCalculationModal isOpen={isTriggerOpen} onOpenChange={setIsTriggerOpen} />
      <AdjustCalculationModal calculation={adjustTarget} onOpenChange={(open) => !open && setAdjustTarget(null)} />
    </div>
  );
};
