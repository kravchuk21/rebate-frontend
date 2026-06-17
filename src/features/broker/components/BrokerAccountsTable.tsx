'use client';

import '@/shared/api/instance';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { BrokerAccountDetailResponse } from '@/shared/api/generated/types.gen';
import { DataTable } from '@/shared/components/DataTable';

import { useMyAccounts } from '../hooks/useMyAccounts';
import { AccountStatusChip } from './AccountStatusChip';

const columnHelper = createColumnHelper<BrokerAccountDetailResponse>();

export const BrokerAccountsTable = () => {
  const t = useTranslations('accounts');
  const locale = useLocale();
  const { data } = useMyAccounts();

  const accounts =
    (data?.data as { items?: BrokerAccountDetailResponse[] } | undefined)?.items ?? [];

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    [locale],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'broker',
        header: t('table.broker'),
        cell: ({ row }) => row.original.broker?.name ?? '—',
      }),
      columnHelper.accessor('uid', {
        header: t('table.uid'),
        cell: (info) => info.getValue() ?? '—',
      }),
      columnHelper.accessor('status', {
        header: t('table.status'),
        cell: (info) => <AccountStatusChip status={info.getValue() ?? ''} />,
      }),
      columnHelper.accessor('created_at', {
        header: t('table.createdAt'),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : '—';
        },
      }),
    ],
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: accounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  return (
    <DataTable
      table={table}
      ariaLabel={t('title')}
      emptyLabel={t('noAccounts')}
      rowHeaderColumnId="broker"
    />
  );
};
