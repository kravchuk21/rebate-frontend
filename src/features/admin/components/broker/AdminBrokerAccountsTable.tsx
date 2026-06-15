'use client';

import '@/shared/api/instance';

import { useState } from 'react';
import { Alert, Button, Card, Skeleton, Table, Tabs } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { BrokerAccountDetailResponse } from '@/shared/api/generated/types.gen';
import { AccountStatusChip } from '@/features/broker/components/AccountStatusChip';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminApproveBrokerAccount } from '../../hooks/useAdminApproveBrokerAccount';
import { useAdminBrokerAccounts } from '../../hooks/useAdminBrokerAccounts';
import { useAdminRejectBrokerAccount } from '../../hooks/useAdminRejectBrokerAccount';
import { useAdminRevokeBrokerAccount } from '../../hooks/useAdminRevokeBrokerAccount';
import { RejectReasonModal } from './RejectReasonModal';

const LIMIT = 20;

export const AdminBrokerAccountsTable = () => {
  const t = useTranslations('admin.brokerAccounts');
  const locale = useLocale();
  const [status, setStatus] = useState<'pending' | 'all'>('pending');
  const [offset, setOffset] = useState(0);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  const { data, isLoading, isError } = useAdminBrokerAccounts({
    status: status === 'pending' ? 'pending' : undefined,
    limit: LIMIT,
    offset,
  });

  const approveAccount = useAdminApproveBrokerAccount();
  const rejectAccount = useAdminRejectBrokerAccount();
  const revokeAccount = useAdminRevokeBrokerAccount();

  const accounts = (data?.data as { items?: BrokerAccountDetailResponse[] } | undefined)?.items ?? [];

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleTabChange = (key: string) => {
    setStatus(key === 'all' ? 'all' : 'pending');
    setOffset(0);
  };

  const handleApprove = (accountID: string) => {
    approveAccount.mutate({ path: { accountID } });
  };

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    rejectAccount.mutate(
      { path: { accountID: rejectTarget }, body: { reason } },
      { onSuccess: () => setRejectTarget(null) },
    );
  };

  const handleRevoke = (reason: string) => {
    if (!revokeTarget) return;
    revokeAccount.mutate(
      { path: { accountID: revokeTarget }, body: { reason } },
      { onSuccess: () => setRevokeTarget(null) },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs onSelectionChange={(key) => handleTabChange(String(key))}>
        <Tabs.ListContainer>
          <Tabs.List>
            <Tabs.Tab id="pending">{t('tabs.pending')}</Tabs.Tab>
            <Tabs.Tab id="all">{t('tabs.all')}</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

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
                  <Table.Column isRowHeader>{t('columns.broker')}</Table.Column>
                  <Table.Column>{t('columns.uid')}</Table.Column>
                  <Table.Column>{t('columns.status')}</Table.Column>
                  <Table.Column>{t('columns.submittedAt')}</Table.Column>
                  <Table.Column>{t('columns.actions')}</Table.Column>
                </Table.Header>
                <Table.Body>
                  {accounts.map((account) => (
                    <Table.Row key={account.id}>
                      <Table.Cell>{account.broker?.name ?? '—'}</Table.Cell>
                      <Table.Cell>{account.uid ?? '—'}</Table.Cell>
                      <Table.Cell>
                        <AccountStatusChip status={account.status ?? ''} />
                      </Table.Cell>
                      <Table.Cell>
                        {account.created_at ? dateFormatter.format(new Date(account.created_at)) : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-2">
                          {account.status === 'pending' && (
                            <>
                              <Button
                                variant="tertiary"
                                size="sm"
                                onPress={() => account.id && handleApprove(account.id)}
                              >
                                {t('actions.approve')}
                              </Button>
                              <Button
                                variant="tertiary"
                                size="sm"
                                onPress={() => setRejectTarget(account.id ?? null)}
                              >
                                {t('actions.reject')}
                              </Button>
                            </>
                          )}
                          {account.status === 'approved' && (
                            <Button
                              variant="tertiary"
                              size="sm"
                              onPress={() => setRevokeTarget(account.id ?? null)}
                            >
                              {t('actions.revoke')}
                            </Button>
                          )}
                        </div>
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
              isDisabled={accounts.length < LIMIT}
              onPress={() => setOffset(offset + LIMIT)}
            >
              →
            </Button>
          </div>
        </>
      )}

      <RejectReasonModal
        type="reject"
        isOpen={rejectTarget !== null}
        isPending={rejectAccount.isPending}
        error={rejectAccount.error}
        errorMessage={getAdminErrorMessage(rejectAccount.error) ?? t('errors.rejectFailed')}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onSubmit={handleReject}
      />

      <RejectReasonModal
        type="revoke"
        isOpen={revokeTarget !== null}
        isPending={revokeAccount.isPending}
        error={revokeAccount.error}
        errorMessage={getAdminErrorMessage(revokeAccount.error) ?? t('errors.revokeFailed')}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        onSubmit={handleRevoke}
      />
    </div>
  );
};
