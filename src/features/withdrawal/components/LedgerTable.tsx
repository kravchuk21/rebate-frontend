'use client';

import '@/shared/api/instance';

import { useEffect, useMemo, useState } from 'react';
import { toast } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { WithdrawalLedgerEntryResponse } from '@/shared/api/generated/types.gen';

import { DataTable } from '@/shared/components/DataTable';
import { useLedger } from '../hooks/useLedger';
import { formatAmountWithSign } from '../lib/formatAmount';
import { LedgerTypeChip } from './LedgerTypeChip';

const LIMIT = 20;

const columnHelper = createColumnHelper<WithdrawalLedgerEntryResponse>();

export const LedgerTable = () => {
  const t = useTranslations('withdrawal.ledger');
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { data, isError } = useLedger(LIMIT, offset);

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const responseData = data?.data as
    | { items?: WithdrawalLedgerEntryResponse[]; total_count?: number }
    | undefined;
  const entries = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }),
    [locale],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('type', {
        header: t('columns.type'),
        cell: (info) => <LedgerTypeChip type={info.getValue() ?? ''} />,
      }),
      columnHelper.accessor('amount', {
        header: t('columns.amount'),
        cell: (info) => {
          const { text, isPositive } = formatAmountWithSign(info.getValue());
          return (
            <span className={isPositive ? 'text-success' : 'text-danger'}>{text} USDT</span>
          );
        },
      }),
      columnHelper.accessor('created_at', {
        header: t('columns.date'),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : '—';
        },
      }),
    ],
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: entries,
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
      rowHeaderColumnId="type"
      pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
    />
  );
};
