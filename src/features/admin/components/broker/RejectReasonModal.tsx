'use client';

import '@/shared/api/instance';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, FieldError, Form, Input, Label, Modal, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { createReasonSchema, type ReasonFormValues } from '../../schemas/reasonSchema';

interface RejectReasonModalProps {
  type: 'reject' | 'revoke';
  isOpen: boolean;
  isPending: boolean;
  error?: unknown;
  errorMessage?: string;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (reason: string) => void;
}

export const RejectReasonModal = ({
  type,
  isOpen,
  isPending,
  error,
  errorMessage,
  onOpenChange,
  onSubmit,
}: RejectReasonModalProps) => {
  const t = useTranslations('admin.brokerAccounts');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReasonFormValues>({
    resolver: zodResolver(createReasonSchema(t(`${type}.validation.reason`))),
    defaultValues: { reason: '' },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
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
              <Modal.Heading>{t(`${type}.title`)}</Modal.Heading>
            </Modal.Header>
            <Form
              onSubmit={handleSubmit((data) => {
                onSubmit(data.reason);
                reset();
              })}
            >
              <Modal.Body className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="reason"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.reason}
                      fullWidth
                    >
                      <Label>{t(`${type}.reason`)}</Label>
                      <Input placeholder={t(`${type}.reasonPlaceholder`)} />
                      <FieldError>{errors.reason?.message}</FieldError>
                    </TextField>
                  )}
                />

                {!!error && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>{errorMessage}</Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" slot="close">
                  {t('reject.cancel')}
                </Button>
                <Button type="submit" variant="primary" isDisabled={isPending}>
                  {t(`${type}.submit`)}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
