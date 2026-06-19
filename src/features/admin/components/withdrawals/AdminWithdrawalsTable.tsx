'use client';

import '@/shared/api/instance';

import { Pencil } from '@gravity-ui/icons';

import { useEffect, useMemo, useState } from 'react';
import { Button, ToggleButton, ToggleButtonGroup, toast } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { WithdrawalResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';
import { truncateAddress } from '@/features/withdrawal/lib/validateAddress';
import { WithdrawalStatusChip } from '@/features/withdrawal/components/WithdrawalStatusChip';
import { DataTable } from '@/shared/components/DataTable';
import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';
import { formatDateYMD } from '@/shared/lib/formatDate';

import { useAdminWithdrawals } from '../../hooks/useAdminWithdrawals';
import { UpdateWithdrawalStatusModal } from './UpdateWithdrawalStatusModal';

const LIMIT = 20;

const STATUSES = ['pending', 'processing', 'completed', 'rejected', 'cancelled'] as const;

const columnHelper = createColumnHelper<WithdrawalResponse>();

export const AdminWithdrawalsTable = () => {
  const t = useTranslations('admin.withdrawals');
  const locale = useLocale();
  const [status, setStatus] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const { open: openUpdate } = useModal(Modals.UpdateWithdrawalStatus);

  const { data, isError } = useAdminWithdrawals({
    status: status ?? undefined,
    limit: LIMIT,
    offset,
  });

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const responseData = data?.data as
    | { items?: WithdrawalResponse[]; total_count?: number }
    | undefined;
  // Stable reference: React Aria's controlled-sort Table re-commits its
  // collection whenever `items` identity changes. A fresh `?? []` every render
  // (notably while the query is loading after a filter switch, when data is
  // undefined) makes the collection never settle and hangs the page.
  const withdrawals = useMemo(() => responseData?.items ?? [], [responseData]);
  const totalCount = responseData?.total_count ?? 0;

  const handleStatusChange = (key: string | null) => {
    setStatus(key === 'all' || key === null ? null : key);
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
          return v ? formatDateYMD(v, locale) : '—';
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
              isIconOnly
              size="sm"
              onPress={() => withdrawal.id && openUpdate({ withdrawalID: withdrawal.id })}
            >
              <Pencil/>
            </Button>
          );
        },
      }),
    ],
    [t, locale, openUpdate],
  );

  const table = useReactTable({
    data: withdrawals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  return (
    <DashboardLayout>
      <DashboardItem>
        <ToggleButtonGroup
          fullWidth
          aria-label={t('filters.status')}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[status ?? 'all']}
          onSelectionChange={(keys) => handleStatusChange(String([...keys][0] ?? 'all'))}
          size='sm'
        >
          <ToggleButton id="all">{t('filters.all')}</ToggleButton>
          {STATUSES.map((s) => (
            <ToggleButton key={s} id={s}>
              {t(`filters.statuses.${s}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </DashboardItem>

      <DashboardItem>
        <DataTable
          table={table}
          ariaLabel={t('title')}
          emptyLabel={t('emptyDesc')}
          rowHeaderColumnId="method"
          pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
        />
      </DashboardItem>

      <UpdateWithdrawalStatusModal />
    </DashboardLayout>
  );
};
