'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, FieldError, Form, Input, Label, Modal, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { getAdminErrorMessage } from '../../lib/getAdminErrorMessage';
import { useAdminImportBrokerData } from '../../hooks/useAdminImportBrokerData';
import {
  createImportBrokerDataSchema,
  type ImportBrokerDataFormValues,
} from '../../schemas/importBrokerDataSchema';

interface ImportBrokerDataModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ImportBrokerDataModal = ({ isOpen, onOpenChange }: ImportBrokerDataModalProps) => {
  const t = useTranslations();
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
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      importBrokerData.reset();
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('admin.rebate.import.title')}</Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="broker_account_id"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.broker_account_id}
                      fullWidth
                    >
                      <Label>{t('admin.rebate.import.brokerAccount')}</Label>
                      <Input />
                      <FieldError>{errors.broker_account_id?.message}</FieldError>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.date}
                      fullWidth
                    >
                      <Label>{t('admin.rebate.import.date')}</Label>
                      <Input type="date" />
                      <FieldError>{errors.date?.message}</FieldError>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="volume"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.volume}
                      fullWidth
                    >
                      <Label>{t('admin.rebate.import.volume')}</Label>
                      <Input />
                      <FieldError>{errors.volume?.message}</FieldError>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="gross_rebate"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.gross_rebate}
                      fullWidth
                    >
                      <Label>{t('admin.rebate.import.grossRebate')}</Label>
                      <Input />
                      <FieldError>{errors.gross_rebate?.message}</FieldError>
                    </TextField>
                  )}
                />

                {importBrokerData.isError && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>
                        {getAdminErrorMessage(importBrokerData.error) ??
                          t('admin.rebate.errors.importFailed')}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
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
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
