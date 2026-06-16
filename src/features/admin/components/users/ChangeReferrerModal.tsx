'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Modal, toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import type { AdminUserResponse } from '@/shared/api/generated/types.gen';
import { FormField } from '@/shared/components/FormField';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminChangeReferrer } from '../../hooks/useAdminChangeReferrer';
import { changeReferrerSchema, type ChangeReferrerFormValues } from '../../schemas/changeReferrerSchema';

interface ChangeReferrerModalProps {
  user: AdminUserResponse | null;
  onOpenChange: (isOpen: boolean) => void;
}

export const ChangeReferrerModal = ({ user, onOpenChange }: ChangeReferrerModalProps) => {
  const t = useTranslations();
  const changeReferrer = useAdminChangeReferrer();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeReferrerFormValues>({
    resolver: zodResolver(changeReferrerSchema),
    defaultValues: { referrer_id: '' },
  });

  const submit = (referrerID: string | null) => {
    if (!user?.id) return;

    changeReferrer.mutate(
      {
        path: { userID: user.id },
        body: { referrer_id: referrerID ?? undefined },
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t('admin.users.errors.referrerFailed'));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      changeReferrer.reset();
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={user !== null} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('admin.users.changeReferrer.title')}</Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit((data) => submit(data.referrer_id || null))}>
              <Modal.Body className="flex flex-col gap-4">
                <p className="text-sm text-muted">
                  {t('admin.users.changeReferrer.currentReferrer')}:{' '}
                  {user?.referred_by_email ?? t('admin.users.changeReferrer.none')}
                </p>

                <FormField
                  control={control}
                  name="referrer_id"
                  label={t('admin.users.changeReferrer.newReferrerID')}
                  placeholder={t('admin.users.changeReferrer.newReferrerIDPlaceholder')}
                  error={errors.referrer_id?.message}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" slot="close">
                  {t('admin.brokerAccounts.reject.cancel')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  isDisabled={changeReferrer.isPending}
                  onPress={() => submit(null)}
                >
                  {t('admin.users.changeReferrer.remove')}
                </Button>
                <Button type="submit" variant="primary" isDisabled={changeReferrer.isPending}>
                  {t('admin.users.changeReferrer.submit')}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
