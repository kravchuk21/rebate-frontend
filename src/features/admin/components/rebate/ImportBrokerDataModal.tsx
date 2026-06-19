'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Modal, toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { BaseModal } from '@/shared/components/BaseModal';
import { FormField } from '@/shared/components/FormField';
import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminImportBrokerData } from '../../hooks/useAdminImportBrokerData';
import {
  createImportBrokerDataSchema,
  type ImportBrokerDataFormValues,
} from '../../schemas/importBrokerDataSchema';

export const ImportBrokerDataModal = () => {
  const t = useTranslations();
  const { isOpen, close } = useModal(Modals.ImportBrokerData);
  const importBrokerData = useAdminImportBrokerData();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ImportBrokerDataFormValues>({
    resolver: zodResolver(createImportBrokerDataSchema(t)),
    defaultValues: { broker_account_id: '', date: '', volume: '', gross_rebate: '' },
  });

  const onSubmit = (data: ImportBrokerDataFormValues) => {
    importBrokerData.mutate(
      { body: data },
      {
        onSuccess: () => {
          reset();
          close();
        },
        onError: (error) => {
          toast.danger(getAdminErrorMessage(error) ?? t('admin.rebate.errors.importFailed'));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      importBrokerData.reset();
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Header>
        <Modal.Heading>{t('admin.rebate.import.title')}</Modal.Heading>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="flex flex-col gap-4">
          <FormField
            control={control}
            name="broker_account_id"
            label={t('admin.rebate.import.brokerAccount')}
            error={errors.broker_account_id?.message}
          />

          <FormField
            control={control}
            name="date"
            label={t('admin.rebate.import.date')}
            error={errors.date?.message}
            inputProps={{ type: 'date' }}
          />

          <FormField
            control={control}
            name="volume"
            label={t('admin.rebate.import.volume')}
            error={errors.volume?.message}
          />

          <FormField
            control={control}
            name="gross_rebate"
            label={t('admin.rebate.import.grossRebate')}
            error={errors.gross_rebate?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="tertiary" slot="close">
            {t('admin.brokerAccounts.reject.cancel')}
          </Button>
          <Button type="submit" variant="primary" isDisabled={importBrokerData.isPending}>
            {t('admin.rebate.import.submit')}
          </Button>
        </Modal.Footer>
      </Form>
    </BaseModal>
  );
};
