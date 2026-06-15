'use client';

import '@/shared/api/instance';

import { useState } from 'react';
import { Alert, Button, Card, Input, Label, Modal, Skeleton, Table } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { AdminAuditLogEntryResponse } from '@/shared/api/generated/types.gen';
import { truncateAddress } from '@/features/withdrawal/lib/validateAddress';

import { useAdminAuditLog } from '../../hooks/useAdminAuditLog';

const LIMIT = 20;

export const AuditLogTable = () => {
  const t = useTranslations('admin.auditLog');
  const locale = useLocale();
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [offset, setOffset] = useState(0);
  const [detailsEntry, setDetailsEntry] = useState<AdminAuditLogEntryResponse | null>(null);

  const { data, isLoading, isError } = useAdminAuditLog({
    action: action || undefined,
    entity_type: entityType || undefined,
    limit: LIMIT,
    offset,
  });

  const entries = (data?.data as { items?: AdminAuditLogEntryResponse[] } | undefined)?.items ?? [];

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
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

      {isError && (
        <Alert status="danger">
          <Alert.Content>
            <Alert.Description>{t('errors.loadFailed')}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {isLoading && (
        <Card>
          <Card.Content className="flex flex-col gap-3 py-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </Card.Content>
        </Card>
      )}

      {!isLoading && !isError && (
        <>
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label={t('title')}>
                <Table.Header>
                  <Table.Column isRowHeader>{t('columns.admin')}</Table.Column>
                  <Table.Column>{t('columns.action')}</Table.Column>
                  <Table.Column>{t('columns.entityType')}</Table.Column>
                  <Table.Column>{t('columns.entityId')}</Table.Column>
                  <Table.Column>{t('columns.date')}</Table.Column>
                  <Table.Column>{t('columns.details')}</Table.Column>
                </Table.Header>
                <Table.Body>
                  {entries.map((entry) => (
                    <Table.Row key={entry.id}>
                      <Table.Cell>{entry.admin_email ?? '—'}</Table.Cell>
                      <Table.Cell>{entry.action ?? '—'}</Table.Cell>
                      <Table.Cell>{entry.entity_type ?? '—'}</Table.Cell>
                      <Table.Cell>{entry.entity_id ? truncateAddress(entry.entity_id) : '—'}</Table.Cell>
                      <Table.Cell>
                        {entry.created_at ? dateFormatter.format(new Date(entry.created_at)) : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        <Button variant="tertiary" size="sm" onPress={() => setDetailsEntry(entry)}>
                          {t('columns.details')}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="tertiary"
              size="sm"
              isDisabled={offset === 0}
              onPress={() => setOffset(Math.max(0, offset - LIMIT))}
            >
              ←
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              isDisabled={entries.length < LIMIT}
              onPress={() => setOffset(offset + LIMIT)}
            >
              →
            </Button>
          </div>
        </>
      )}

      <Modal isOpen={detailsEntry !== null} onOpenChange={(open) => !open && setDetailsEntry(null)}>
        <Modal.Backdrop>
          <Modal.Container>
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
