'use client';

import '@/shared/api/instance';

import { useEffect, useMemo, useState } from 'react';
import { Button, Chip, Input, Label, Modal, toast, Typography } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DashboardLayout, DashboardItem } from '@/shared/components/layout';
import { InfoIcon } from '@heroui/react';

import type { AdminAuditLogEntryResponse } from '@/shared/api/generated/types.gen';
// import { truncateAddress } from '@/features/withdrawal/lib/validateAddress';
import { BaseModal } from '@/shared/components/BaseModal';
import { DataTable } from '@/shared/components/DataTable';
import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';
import { formatDateYMD } from '@/shared/lib/formatDate';

import { useAdminAuditLog } from '../../hooks/useAdminAuditLog';
import { CopyButton } from '@/shared/components/CopyButton';

const LIMIT = 20;

const columnHelper = createColumnHelper<AdminAuditLogEntryResponse>();

export const AuditLogTable = () => {
  const t = useTranslations('admin.auditLog');
  const locale = useLocale();
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [debouncedAction, setDebouncedAction] = useState('');
  const [debouncedEntityType, setDebouncedEntityType] = useState('');
  const [offset, setOffset] = useState(0);
  const {
    isOpen: isDetailsOpen,
    open: openDetails,
    close: closeDetails,
    param: detailsParam,
  } = useModal(Modals.AuditDetails);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedAction(action);
      setOffset(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [action]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedEntityType(entityType);
      setOffset(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [entityType]);

  const { data, isError } = useAdminAuditLog({
    action: debouncedAction || undefined,
    entity_type: debouncedEntityType || undefined,
    limit: LIMIT,
    offset,
  });

  useEffect(() => {
    if (isError) toast.danger(t('errors.loadFailed'));
  }, [isError, t]);

  const responseData = data?.data as
    | { items?: AdminAuditLogEntryResponse[]; total_count?: number }
    | undefined;
  const entries = useMemo(() => responseData?.items ?? [], [responseData]);
  const totalCount = responseData?.total_count ?? 0;

  const detailsEntryId = detailsParam('entryId');
  const detailsEntry = useMemo(
    () => entries.find((entry) => entry.id === detailsEntryId) ?? null,
    [entries, detailsEntryId],
  );

  // columnHelper.accessor('status', {
  //   header: t('columns.status'),
  //   cell: (info) => <AccountStatusChip status={info.getValue() ?? ''} />,
  // }),

  const columns = useMemo(
    () => [
      columnHelper.accessor('admin_email', {
        header: t('columns.admin'),
        cell: (info) => info.getValue() ?? '—',
      }),
      columnHelper.accessor('action', {
        header: t('columns.action'),
        cell: (info) => <div className='flex gap-2'><Chip>{info.getValue() ?? '—'}</Chip><CopyButton value={info.getValue() ?? '—'} /></div>,
      }),
      columnHelper.accessor('entity_type', {
        header: t('columns.entityType'),
        cell: (info) => <div className='flex gap-2'><Chip>{info.getValue() ?? '—'}</Chip><CopyButton value={info.getValue() ?? '—'} /></div>,
      }),
      // columnHelper.accessor('entity_id', {
      //   header: t('columns.entityId'),
      //   cell: (info) => {
      //     const v = info.getValue();
      //     return v ? truncateAddress(v) : '—';
      //   },
      // }),
      columnHelper.accessor('created_at', {
        header: t('columns.date'),
        cell: (info) => {
          const v = info.getValue();
          return v ? formatDateYMD(v, locale) : '—';
        },
      }),
      columnHelper.display({
        id: 'details',
        header: t('columns.details'),
        cell: ({ row }) => (
          <Button
            isIconOnly
            variant="tertiary"
            size="sm"
            onPress={() => row.original.id && openDetails({ entryId: row.original.id })}
          >
            <InfoIcon />
          </Button>
        ),
      }),
    ],
    [t, locale, openDetails],
  );

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? String(index),
  });

  return (
    <DashboardLayout>
      <DashboardItem span={6}>
        <Input variant='secondary' fullWidth value={action} placeholder={t('filters.action')} onChange={(e) => setAction(e.target.value)} />
      </DashboardItem>
      <DashboardItem span={6}>
        <Input variant='secondary' fullWidth value={entityType} placeholder={t('filters.entityType')} onChange={(e) => setEntityType(e.target.value)} />
      </DashboardItem>

      <DashboardItem>
        <DataTable
          table={table}
          ariaLabel={t('title')}
          emptyLabel={t('emptyDesc')}
          rowHeaderColumnId="admin_email"
          pagination={{ offset, limit: LIMIT, totalCount, onOffsetChange: setOffset }}
        />
      </DashboardItem>

      <BaseModal
        isOpen={isDetailsOpen && detailsEntry !== null}
        onOpenChange={(open) => !open && closeDetails()}
        dialogClassName="sm:max-w-[480px]"
      >
        <Modal.Header>
          <Modal.Heading>{t('details.title')}</Modal.Heading>
        </Modal.Header>
        <Modal.Body>
          <DashboardLayout>
            <DashboardItem>
              <Typography.Paragraph size='sm' color='muted'>{t('details.oldValue')}</Typography.Paragraph>
              <Typography.Code>
                {JSON.stringify(detailsEntry?.old_value ?? null, null, 2)}
              </Typography.Code>
            </DashboardItem>
            <DashboardItem>
              <Typography.Paragraph size='sm' color='muted'>{t('details.newValue')}</Typography.Paragraph>
              <Typography.Code>
                {JSON.stringify(detailsEntry?.new_value ?? null, null, 2)}
              </Typography.Code>
            </DashboardItem>
          </DashboardLayout>
        </Modal.Body>
      </BaseModal>
    </DashboardLayout>
  );
};
