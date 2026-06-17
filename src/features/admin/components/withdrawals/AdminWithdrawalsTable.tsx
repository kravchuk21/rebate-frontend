'use client';

import '@/shared/api/instance';

import { useEffect, useMemo, useState } from 'react';
import { Button, Tabs, toast } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { WithdrawalResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';
import { truncateAddress } from '@/features/withdrawal/lib/validateAddress';
import { WithdrawalStatusChip } from '@/features/withdrawal/components/WithdrawalStatusChip';
import { DataTable } from '@/shared/components/DataTable';

import { useAdminWithdrawals } from '../../hooks/useAdminWithdrawals';
import { UpdateWithdrawalStatusModal } from './UpdateWithdrawalStatusModal';

const LIMIT = 20;

const columnHelper = createColumnHelper<WithdrawalResponse>();

export const AdminWithdrawalsTable = () => {
  const t = useTranslations('admin.withdrawals');
  const locale = useLocale();
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [offset, setOffset] = useState(0);
  const [updateTarget, setUpdateTarget] = useState<string | null>(null);

  const { data, isError } = useAdminWithdrawals({
    status: tab === 'pending' ? 'pending' : undefined,
    limit: LIMIT,
    offset,
  });

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const responseData = data?.data as
    | { items?: WithdrawalResponse[]; total_count?: number }
    | undefined;
  const withdrawals = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }),
    [locale],
  );

  const handleTabChange = (key: string) => {
    setTab(key === 'all' ? 'all' : 'pending');
    setOffset(0);
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'method',
        header: t('columns.method'),
        cell: ({ row }) => {
          const { payout_method } = row.original;
          return payout_method ? `${payout_method.name} (${payout_method.network})` : '—';
        },
      }),
      columnHelper.accessor('amount_requested', {
        header: t('columns.amount'),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
      columnHelper.accessor('amount_to_send', {
        header: t('columns.toSend'),
        cell: (info) => {
          const v = info.getValue();
          return v != null ? `${formatAmount(v)} USDT` : '—';
        },
      }),
      columnHelper.accessor('status', {
        header: t('columns.status'),
        cell: (info) => <WithdrawalStatusChip status={info.getValue() ?? ''} />,
      }),
      columnHelper.accessor('requested_at', {
        header: t('columns.requestedAt'),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : '—';
        },
      }),
      columnHelper.accessor('tx_hash', {
        header: t('columns.txHash'),
        cell: (info) => {
          const v = info.getValue();
          return v ? truncateAddress(v) : '—';
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: t('columns.actions'),
        cell: ({ row }) => {
          const withdrawal = row.original;
          return (
            <Button
              variant="tertiary"
              size="sm"
              onPress={() => setUpdateTarget(withdrawal.id ?? null)}
            >
              {t('updateStatus.title')}
            </Button>
          );
        },
      }),
    ],
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: withdrawals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

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

      {!isError && (
        <DataTable
          table={table}
          ariaLabel={t('title')}
          emptyLabel={t('emptyDesc')}
          rowHeaderColumnId="method"
          pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
        />
      )}

      <UpdateWithdrawalStatusModal
        withdrawalID={updateTarget}
        onOpenChange={(open) => !open && setUpdateTarget(null)}
      />
    </div>
  );
};
