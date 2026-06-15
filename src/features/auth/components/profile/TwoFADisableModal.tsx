'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  TextField,
  Typography,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import { useTwoFADisable } from '@/features/auth/hooks/useTwoFADisable';

interface TwoFADisableModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDisabled: () => void;
}

const createDisableSchema = (t: (key: string) => string) =>
  z.object({
    password: z.string().min(1, t('profile.password.validation.current')),
    code: z.string().min(6, t('twoFA.errors.codeRequired')),
  });

type DisableFormValues = z.infer<ReturnType<typeof createDisableSchema>>;

export const TwoFADisableModal = ({ isOpen, onOpenChange, onDisabled }: TwoFADisableModalProps) => {
  const t = useTranslations();
  const disable = useTwoFADisable();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DisableFormValues>({
    resolver: zodResolver(createDisableSchema(t)),
    defaultValues: { password: '', code: '' },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      disable.reset();
    }
    onOpenChange(open);
  };

  const onSubmit = (data: DisableFormValues) => {
    disable.mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
        onDisabled();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('profile.twoFA.disable.title')}</Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <Typography type="body-sm">{t('profile.twoFA.disable.desc')}</Typography>

                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <TextField
                      type="password"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.password}
                      fullWidth
                    >
                      <Label>{t('profile.twoFA.disable.password')}</Label>
                      <Input />
                      <FieldError>{errors.password?.message}</FieldError>
                    </TextField>
                  )}
                />

                <Controller
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      isInvalid={!!errors.code}
                      fullWidth
                    >
                      <Label>{t('profile.twoFA.disable.code')}</Label>
                      <Input />
                      <FieldError>{errors.code?.message}</FieldError>
                    </TextField>
                  )}
                />

                {disable.isError && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Description>
                        {getErrorMessage(disable.error) ?? t('auth.errors.generic')}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" slot="close">
                  {t('profile.cancel')}
                </Button>
                <Button type="submit" variant="danger" isDisabled={disable.isPending}>
                  {disable.isPending
                    ? t('profile.twoFA.disable.submitting')
                    : t('profile.twoFA.disable.submit')}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
