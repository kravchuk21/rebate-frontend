'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FieldError,
  Form,
  Label,
  ListBox,
  Modal,
  Select,
  toast,
  Typography,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import { BaseModal } from '@/shared/components/BaseModal';
import { FormField } from '@/shared/components/FormField';
import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';

import { useCreatePayoutMethod } from '../hooks/useCreatePayoutMethod';
import {
  createPayoutMethodSchema,
  type PayoutMethodFormValues,
} from '../schemas/payoutMethodSchema';

const networks = ['TRC20', 'ERC20', 'BEP20', 'SOL'] as const;

export const AddPayoutMethodModal = () => {
  const t = useTranslations();
  const { isOpen, close } = useModal(Modals.AddPayoutMethod);
  const createPayoutMethod = useCreatePayoutMethod();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayoutMethodFormValues>({
    resolver: zodResolver(createPayoutMethodSchema(t)),
    defaultValues: { name: '', network: 'TRC20', address: '' },
  });

  const onSubmit = (data: PayoutMethodFormValues) => {
    createPayoutMethod.mutate(
      { body: data },
      {
        onSuccess: () => {
          reset();
          close();
        },
        onError: (error) => {
          toast.danger(getErrorMessage(error) ?? t('withdrawal.payoutMethods.errors.addFailed'));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      createPayoutMethod.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t('withdrawal.payoutMethods.form.title')}</Modal.Heading>
        <Typography.Paragraph size='sm' color='muted'>
          {t('withdrawal.payoutMethods.form.description')}
        </Typography.Paragraph>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="flex flex-col gap-4">
          <FormField
            control={control}
            name="name"
            label={t('withdrawal.payoutMethods.form.name')}
            placeholder={t('withdrawal.payoutMethods.form.namePlaceholder')}
            error={errors.name?.message}
          />

          <Controller
            control={control}
            name="network"
            render={() => (
              <Select
                className="w-full"
                placeholder={t('withdrawal.payoutMethods.form.networkPlaceholder')}
                isInvalid={!!errors.network}
                variant="secondary"
              >
                <Label>{t('withdrawal.payoutMethods.form.network')}</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {networks.map((network) => (
                      <ListBox.Item
                        key={network}
                        id={network}
                        textValue={t(`withdrawal.payoutMethods.networks.${network}`)}
                      >
                        {t(`withdrawal.payoutMethods.networks.${network}`)}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError>{errors.network?.message}</FieldError>
              </Select>
            )}
          />

          <FormField
            control={control}
            name="address"
            label={t('withdrawal.payoutMethods.form.address')}
            placeholder={t('withdrawal.payoutMethods.form.addressPlaceholder')}
            error={errors.address?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t('withdrawal.payoutMethods.cancel')}
          </Button>
          <Button type="submit" variant="primary" isDisabled={createPayoutMethod.isPending}>
            {createPayoutMethod.isPending
              ? t('withdrawal.payoutMethods.form.submitting')
              : t('withdrawal.payoutMethods.form.submit')}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
