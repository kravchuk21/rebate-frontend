'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Modal, toast, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import { useTwoFADisable } from '@/features/auth/hooks/useTwoFADisable';
import { FormField } from '@/shared/components/FormField';

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
      onError: (error) => {
        toast.danger(getErrorMessage(error) ?? t('auth.errors.generic'));
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container scroll='outside'>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('profile.twoFA.disable.title')}</Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                <Typography.Paragraph size="sm">{t('profile.twoFA.disable.desc')}</Typography.Paragraph>

                <FormField
                  control={control}
                  name="password"
                  type="password"
                  label={t('profile.twoFA.disable.password')}
                  error={errors.password?.message}
                />

                <FormField
                  control={control}
                  name="code"
                  label={t('profile.twoFA.disable.code')}
                  error={errors.code?.message}
                />
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
