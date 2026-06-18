'use client';

import '@/shared/api/instance';

import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Label, Modal, toast } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { AdminAuditLogEntryResponse } from '@/shared/api/generated/types.gen';
import { truncateAddress } from '@/features/withdrawal/lib/validateAddress';
import { DataTable } from '@/shared/components/DataTable';

import { useAdminAuditLog } from '../../hooks/useAdminAuditLog';

const LIMIT = 20;

const columnHelper = createColumnHelper<AdminAuditLogEntryResponse>();

export const AuditLogTable = () => {
  const t = useTranslations('admin.auditLog');
  const locale = useLocale();
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [offset, setOffset] = useState(0);
  const [detailsEntry, setDetailsEntry] = useState<AdminAuditLogEntryResponse | null>(null);

  const { data, isError } = useAdminAuditLog({
    action: action || undefined,
    entity_type: entityType || undefined,
    limit: LIMIT,
    offset,
  });

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const responseData = data?.data as
    | { items?: AdminAuditLogEntryResponse[]; total_count?: number }
    | undefined;
  const entries = responseData?.items ?? [];
  const totalCount = responseData?.total_count ?? 0;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }),
    [locale],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('admin_email', {
        header: t('columns.admin'),
        cell: (info) => info.getValue() ?? '—',
      }),
      columnHelper.accessor('action', {
        header: t('columns.action'),
        cell: (info) => info.getValue() ?? '—',
      }),
      columnHelper.accessor('entity_type', {
        header: t('columns.entityType'),
        cell: (info) => info.getValue() ?? '—',
      }),
      columnHelper.accessor('entity_id', {
        header: t('columns.entityId'),
        cell: (info) => {
          const v = info.getValue();
          return v ? truncateAddress(v) : '—';
        },
      }),
      columnHelper.accessor('created_at', {
        header: t('columns.date'),
        cell: (info) => {
          const v = info.getValue();
          return v ? dateFormatter.format(new Date(v)) : '—';
        },
      }),
      columnHelper.display({
        id: 'details',
        header: t('columns.details'),
        cell: ({ row }) => (
          <Button variant="tertiary" size="sm" onPress={() => setDetailsEntry(row.original)}>
            {t('columns.details')}
          </Button>
        ),
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1">
          <Label>{t('filters.action')}</Label>
          <Input
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setOffset(0);
            }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label>{t('filters.entityType')}</Label>
          <Input
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setOffset(0);
            }}
          />
        </div>
      </div>

      {!isError && (
        <DataTable
          table={table}
          ariaLabel={t('title')}
          emptyLabel={t('emptyDesc')}
          rowHeaderColumnId="admin_email"
          pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
        />
      )}

      <Modal isOpen={detailsEntry !== null} onOpenChange={(open) => !open && setDetailsEntry(null)}>
        <Modal.Backdrop>
          <Modal.Container scroll='outside'>
            <Modal.Dialog className="sm:max-w-[480px]">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>{t('details.title')}</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium">{t('details.oldValue')}</p>
                  <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(detailsEntry?.old_value ?? null, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('details.newValue')}</p>
                  <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(detailsEntry?.new_value ?? null, null, 2)}
                  </pre>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" slot="close">
                  {t('details.close')}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};
