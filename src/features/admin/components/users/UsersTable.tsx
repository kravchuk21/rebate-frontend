'use client';

import '@/shared/api/instance';

import { useEffect, useState } from 'react';
import { AlertDialog, Alert, Button, Card, Input, Skeleton, Table } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import type { AdminUserResponse } from '@/shared/api/generated/types.gen';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminSuspendUser } from '../../hooks/useAdminSuspendUser';
import { useAdminUnsuspendUser } from '../../hooks/useAdminUnsuspendUser';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { AdjustBalanceModal } from './AdjustBalanceModal';
import { ChangeReferrerModal } from './ChangeReferrerModal';
import { UserStatusChip } from './UserStatusChip';

const LIMIT = 20;

export const UsersTable = () => {
  const t = useTranslations('admin.users');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [adjustBalanceTarget, setAdjustBalanceTarget] = useState<string | null>(null);
  const [referrerTarget, setReferrerTarget] = useState<AdminUserResponse | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isError } = useAdminUsers({
    search: debouncedSearch || undefined,
    limit: LIMIT,
    offset,
  });

  const suspendUser = useAdminSuspendUser();
  const unsuspendUser = useAdminUnsuspendUser();

  const users = (data?.data as { items?: AdminUserResponse[] } | undefined)?.items ?? [];

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  });

  const handleSuspend = (userID: string) => {
    suspendUser.mutate(
      { path: { userID } },
      {
        onSuccess: () => setSuspendTarget(null),
      },
    );
  };

  const handleUnsuspend = (userID: string) => {
    unsuspendUser.mutate({ path: { userID } });
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('search')}
        className="max-w-sm"
      />

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
                  <Table.Column isRowHeader>{t('columns.email')}</Table.Column>
                  <Table.Column>{t('columns.role')}</Table.Column>
                  <Table.Column>{t('columns.status')}</Table.Column>
                  <Table.Column>{t('columns.twoFa')}</Table.Column>
                  <Table.Column>{t('columns.createdAt')}</Table.Column>
                  <Table.Column>{t('columns.actions')}</Table.Column>
                </Table.Header>
                <Table.Body>
                  {users.map((user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{user.role}</Table.Cell>
                      <Table.Cell>
                        <UserStatusChip status={user.status ?? ''} />
                      </Table.Cell>
                      <Table.Cell>{user.two_fa_enabled ? 'Yes' : 'No'}</Table.Cell>
                      <Table.Cell>
                        {user.created_at ? dateFormatter.format(new Date(user.created_at)) : '—'}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-2">
                          {user.status === 'suspended' ? (
                            <Button
                              variant="tertiary"
                              size="sm"
                              onPress={() => user.id && handleUnsuspend(user.id)}
                            >
                              {t('actions.unsuspend')}
                            </Button>
                          ) : (
                            <Button
                              variant="tertiary"
                              size="sm"
                              onPress={() => setSuspendTarget(user.id ?? null)}
                            >
                              {t('actions.suspend')}
                            </Button>
                          )}
                          <Button
                            variant="tertiary"
                            size="sm"
                            onPress={() => setAdjustBalanceTarget(user.id ?? null)}
                          >
                            {t('actions.adjustBalance')}
                          </Button>
                          <Button
                            variant="tertiary"
                            size="sm"
                            onPress={() => setReferrerTarget(user)}
                          >
                            {t('actions.changeReferrer')}
                          </Button>
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
              isDisabled={users.length < LIMIT}
              onPress={() => setOffset(offset + LIMIT)}
            >
              →
            </Button>
          </div>
        </>
      )}

      <AlertDialog
        isOpen={suspendTarget !== null}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
      >
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>{t('suspend.confirmTitle')}</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body className="flex flex-col gap-3">
                <p>{t('suspend.confirmDesc')}</p>
                {suspendUser.isError && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>
                        {getAdminErrorMessage(suspendUser.error) ?? t('errors.suspendFailed')}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="tertiary" slot="close">
                  {t('suspend.cancel')}
                </Button>
                <Button
                  variant="primary"
                  onPress={() => suspendTarget && handleSuspend(suspendTarget)}
                  isDisabled={suspendUser.isPending}
                >
                  {t('suspend.confirm')}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>

      <AdjustBalanceModal userID={adjustBalanceTarget} onOpenChange={(open) => !open && setAdjustBalanceTarget(null)} />
      <ChangeReferrerModal user={referrerTarget} onOpenChange={(open) => !open && setReferrerTarget(null)} />
    </div>
  );
};
