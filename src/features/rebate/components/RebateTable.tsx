'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { RebateCalculationResponse } from '@/shared/api/generated/types.gen';
import { formatAmount } from '@/features/withdrawal/lib/formatAmount';
import { DataTable } from '@/shared/components/DataTable';

import { useMyCalculations } from '../hooks/useMyCalculations';
import { formatPeriodDate } from '../lib/formatPeriodDate';
import { RebateStatusChip } from './RebateStatusChip';

const LIMIT = 20;

const columnHelper = createColumnHelper<RebateCalculationResponse>();

export const RebateTable = () => {
  const t = useTranslations('rebate');
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { data, isError } = useMyCalculations(LIMIT, offset);

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const responseData = data?.data as
    | { items?: RebateCalculationResponse[]; total_count?: number }
    | undefined;
  const items = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'broker',
        header: t('columns.broker'),
        cell: ({ row }) => row.original.broker_account?.broker_name ?? '—',
      }),
      columnHelper.display({
        id: 'uid',
        header: t('columns.uid'),
        cell: ({ row }) => row.original.broker_account?.uid ?? '—',
      }),
      columnHelper.accessor('period_date', {
        header: t('columns.period'),
        cell: (info) => formatPeriodDate(info.getValue(), locale),
      }),
      columnHelper.accessor('broker_volume', {
        header: t('columns.volume'),
        cell: (info) => formatAmount(info.getValue()),
      }),
      columnHelper.accessor('gross_rebate', {
        header: t('columns.grossRebate'),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
      columnHelper.accessor('our_fee_amount', {
        header: t('columns.ourFee'),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
      columnHelper.accessor('referrer_amount', {
        header: t('columns.referrerAmount'),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
      columnHelper.accessor('user_payout_amount', {
        header: t('columns.yourPayout'),
        cell: (info) => `${formatAmount(info.getValue())} USDT`,
      }),
      columnHelper.accessor('status', {
        header: t('columns.status'),
        cell: (info) => <RebateStatusChip status={info.getValue() ?? ''} />,
      }),
    ],
    [t, locale],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  if (isError) return null;

  return (
    <DataTable
      table={table}
      ariaLabel={t('title')}
      emptyLabel={t('empty')}
      rowHeaderColumnId="broker"
      pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
    />
  );
};
