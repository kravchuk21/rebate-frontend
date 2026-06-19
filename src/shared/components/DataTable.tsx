"use client";

import type { SortDescriptor } from "@heroui/react";
import type { Table as ReactTableInstance } from "@tanstack/react-table";

import { useCallback } from "react";
import { Table } from "@heroui/react";
import { flexRender } from "@tanstack/react-table";

import { TableEmptyState } from "./TableEmptyState";
import { TablePagination } from "./TablePagination";

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
  const rows = table.getRowModel().rows;

  const renderEmptyState = useCallback(() => <TableEmptyState label={emptyLabel} />, [emptyLabel]);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label={ariaLabel}
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
        >
          {/*
            Header columns use React Aria's keyed `columns` prop so a stable
            react-table header object reuses its cached collection node instead of
            rebuilding on every render. Row cells are mapped inline below because
            `Table.Row`'s `columns` prop is ignored for function children by
            react-aria-components (it always resolves cells from the table-wide
            column context, not from per-row props).
          */}
          <Table.Header columns={headers}>
            {(header) => (
              <Table.Column
                id={header.id}
                allowsSorting={onSortChange ? header.column.getCanSort() : false}
                isRowHeader={header.id === rowHeaderId}
                className="text-nowrap"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={rows} renderEmptyState={renderEmptyState}>
            {(row) => (
              <Table.Row id={row.id} className="text-nowrap">
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>

      {pagination && <TablePagination {...pagination} />}
    </Table>
  );
}
