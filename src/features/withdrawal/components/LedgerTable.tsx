'use client';

import '@/shared/api/instance';

import { useEffect, useMemo, useState } from 'react';
import { Table, toast } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { WithdrawalLedgerEntryResponse } from '@/shared/api/generated/types.gen';

import { TableEmptyState } from '@/shared/components/TableEmptyState';
import { TablePagination } from '@/shared/components/TablePagination';
import { useLedger } from '../hooks/useLedger';
import { formatAmountWithSign } from '../lib/formatAmount';
import { LedgerTypeChip } from './LedgerTypeChip';

const LIMIT = 10;

export const LedgerTable = () => {
  const t = useTranslations('withdrawal.ledger');
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isError } = useLedger(LIMIT, offset);

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

  const columnHelper = createColumnHelper<WithdrawalLedgerEntryResponse>();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, dateFormatter],
  );

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) return null;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={t('title')}>
          <Table.Header>
            {table.getHeaderGroups()[0]!.headers.map((header) => (
              <Table.Column key={header.id} isRowHeader={header.id === 'type'}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body renderEmptyState={() => <TableEmptyState label={t('empty')} />}>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id} id={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>

      <TablePagination
        offset={offset}
        limit={LIMIT}
        totalCount={totalCount}
        onOffsetChange={setOffset}
      />
    </Table>
  );
};
