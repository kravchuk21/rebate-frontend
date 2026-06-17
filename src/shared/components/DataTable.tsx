'use client';

import type { SortDescriptor } from '@heroui/react';
import type { Table as ReactTableInstance } from '@tanstack/react-table';

import { Table } from '@heroui/react';
import { flexRender } from '@tanstack/react-table';

import { TableEmptyState } from './TableEmptyState';
import { TablePagination } from './TablePagination';

interface DataTablePagination {
  offset: number;
  limit: number;
  totalCount: number;
  onOffsetChange: (offset: number) => void;
}

interface DataTableProps<T> {
  table: ReactTableInstance<T>;
  ariaLabel: string;
  emptyLabel: string;
  rowHeaderColumnId?: string;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  pagination?: DataTablePagination;
}

export function DataTable<T>({
  table,
  ariaLabel,
  emptyLabel,
  rowHeaderColumnId,
  sortDescriptor,
  onSortChange,
  pagination,
}: DataTableProps<T>) {
  const headers = table.getHeaderGroups()[0]!.headers;
  const rowHeaderId = rowHeaderColumnId ?? headers[0]?.id;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label={ariaLabel}
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
        >
          <Table.Header>
            {headers.map((header) => (
              <Table.Column
                key={header.id}
                id={header.id}
                allowsSorting={header.column.getCanSort()}
                isRowHeader={header.id === rowHeaderId}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body renderEmptyState={() => <TableEmptyState label={emptyLabel} />}>
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

      {pagination && <TablePagination {...pagination} />}
    </Table>
  );
}
