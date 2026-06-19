'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FieldError, Form, Label, ListBox, Modal, Select, toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import type { WithdrawalPayoutMethodResponse } from '@/shared/api/generated/types.gen';
import { BaseModal } from '@/shared/components/BaseModal';
import { FormField } from '@/shared/components/FormField';
import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';

import { useCreateWithdrawal } from '../hooks/useCreateWithdrawal';
import { usePayoutMethods } from '../hooks/usePayoutMethods';
import {
  createWithdrawalSchema,
  type WithdrawalFormValues,
} from '../schemas/withdrawalSchema';

export const CreateWithdrawalModal = () => {
  const t = useTranslations();
  const { isOpen, close } = useModal(Modals.CreateWithdrawal);
  const { open: openAddMethod } = useModal(Modals.AddPayoutMethod);
  const { data: payoutMethodsData } = usePayoutMethods();
  const methods = (payoutMethodsData?.data as WithdrawalPayoutMethodResponse[] | undefined) ?? [];

  const createWithdrawal = useCreateWithdrawal();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(createWithdrawalSchema(t)),
    defaultValues: { payout_method_id: '', amount: '' },
  });

  const onSubmit = (data: WithdrawalFormValues) => {
    createWithdrawal.mutate(
      {
        body: {
          payout_method_id: data.payout_method_id,
          amount_requested: Number(data.amount),
        },
      },
      {
        onSuccess: () => {
          reset();
          close();
        },
        onError: (error) => {
          toast.danger(getErrorMessage(error) ?? t('withdrawal.request.errors.failed'));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      createWithdrawal.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t('withdrawal.request.title')}</Modal.Heading>
      </Modal.Header>

      {methods.length === 0 ? (
        <>
          <Modal.Body className="flex flex-col gap-4 py-8 text-center">
            <p className="text-muted">{t('withdrawal.request.noMethods')}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" slot="close">
              {t('withdrawal.payoutMethods.cancel')}
            </Button>
            <Button variant="primary" onPress={() => openAddMethod()}>
              {t('withdrawal.request.addMethod')}
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="flex flex-col gap-4">
            <Controller
              control={control}
              name="payout_method_id"
              render={({ field }) => (
                <Select
                  variant='secondary'
                  className="w-full"
                  placeholder={t('withdrawal.request.methodPlaceholder')}
                  value={field.value || null}
                  onChange={(key) => field.onChange(key ? String(key) : '')}
                  isInvalid={!!errors.payout_method_id}
                >
                  <Label>{t('withdrawal.request.method')}</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {methods.map((method) => (
                        <ListBox.Item
                          key={method.id}
                          id={method.id}
                          textValue={`${method.name} (${method.network})`}
                        >
                          {method.name} ({method.network})
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError>{errors.payout_method_id?.message}</FieldError>
                </Select>
              )}
            />

            <FormField
              control={control}
              name="amount"
              label={t('withdrawal.request.amount')}
              placeholder={t('withdrawal.request.amountPlaceholder')}
              error={errors.amount?.message}
              inputProps={{ type: 'number', step: '0.01', min: '0' }}
            />

            <p className="text-sm text-muted">{t('withdrawal.request.feeNote')}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" slot="close">
              {t('withdrawal.payoutMethods.cancel')}
            </Button>
            <Button type="submit" variant="primary" isDisabled={createWithdrawal.isPending}>
              {createWithdrawal.isPending
                ? t('withdrawal.request.submitting')
                : t('withdrawal.request.submit')}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </BaseModal>
  );
};
