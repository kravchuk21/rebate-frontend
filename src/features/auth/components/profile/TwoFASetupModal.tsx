'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Modal, toast, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import { useTwoFAConfirm } from '@/features/auth/hooks/useTwoFAConfirm';
import { useTwoFAInitiate } from '@/features/auth/hooks/useTwoFAInitiate';
import { BaseModal } from '@/shared/components/BaseModal';
import { FormField } from '@/shared/components/FormField';
import { useModal } from '@/shared/hooks/useModal';
import { Modals } from '@/shared/lib/routes';

interface TwoFASetupModalProps {
  onEnabled: () => void;
}

const createConfirmSchema = (t: (key: string) => string) =>
  z.object({
    password: z.string().min(1, t('profile.password.validation.current')),
    code: z.string().min(6, t('twoFA.errors.codeRequired')),
  });

type ConfirmFormValues = z.infer<ReturnType<typeof createConfirmSchema>>;

export const TwoFASetupModal = ({ onEnabled }: TwoFASetupModalProps) => {
  const t = useTranslations();
  const { isOpen, close } = useModal(Modals.TwoFASetup);
  const initiate = useTwoFAInitiate();
  const confirm = useTwoFAConfirm();
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfirmFormValues>({
    resolver: zodResolver(createConfirmSchema(t)),
    defaultValues: { password: '', code: '' },
  });

  useEffect(() => {
    if (isOpen && !initiate.data && !initiate.isPending) {
      initiate.mutate(undefined, {
        onError: (error) => {
          toast.danger(getErrorMessage(error) ?? t('auth.errors.generic'));
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      initiate.reset();
      confirm.reset();
      setBackupCodes(null);
      close();
    }
  };

  const onSubmit = (data: ConfirmFormValues) => {
    confirm.mutate(data, {
      onSuccess: (response) => {
        setBackupCodes(response.backup_codes ?? []);
      },
      onError: (error) => {
        toast.danger(getErrorMessage(error) ?? t('auth.errors.generic'));
      },
    });
  };

  const handleDone = () => {
    setBackupCodes(null);
    initiate.reset();
    confirm.reset();
    reset();
    close();
    onEnabled();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      dialogClassName="sm:max-w-[480px]"
    >
      <Modal.Header>
        <Modal.Heading>
          {backupCodes
            ? t('profile.twoFA.backupCodes.title')
            : t('profile.twoFA.setup.step1Title')}
        </Modal.Heading>
      </Modal.Header>

      {backupCodes ? (
        <>
          <Modal.Body className="flex flex-col gap-3">
            <Typography type="body-sm">{t('profile.twoFA.backupCodes.desc')}</Typography>
            <div className="grid grid-cols-2 gap-2 rounded-lg border p-4 font-mono text-sm">
              {backupCodes.map((code) => (
                <span key={code}>{code}</span>
              ))}
            </div>
            <Alert status="warning">
              <Alert.Content>
                <Alert.Description>{t('profile.twoFA.backupCodes.warning')}</Alert.Description>
              </Alert.Content>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onPress={handleDone}>
              {t('profile.twoFA.backupCodes.confirm')}
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="flex flex-col gap-4">
            {initiate.isPending && <Typography type="body-sm">…</Typography>}

            {initiate.data && (
              <>
                <Typography type="body-sm">{t('profile.twoFA.setup.step1Desc')}</Typography>
                <div className="flex justify-center">
                  <QRCodeSVG marginSize={4} value={initiate.data.qr_code_uri ?? ''} size={200} />
                </div>
                <Typography type="body-sm" color="muted">
                  {t('profile.twoFA.setup.manualEntry')}
                </Typography>
                <Typography.Code>{initiate.data.secret}</Typography.Code>

                <Typography.Paragraph size="sm" className="mt-2">
                  {t('profile.twoFA.setup.step2Desc')}
                </Typography.Paragraph>

                <FormField
                  control={control}
                  name="password"
                  type="password"
                  label={t('profile.twoFA.setup.password')}
                  error={errors.password?.message}
                />

                <FormField
                  control={control}
                  name="code"
                  label={t('profile.twoFA.setup.code')}
                  error={errors.code?.message}
                />
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" slot="close">
              {t('profile.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={!initiate.data || confirm.isPending}
            >
              {confirm.isPending
                ? t('profile.twoFA.setup.submitting')
                : t('profile.twoFA.setup.submit')}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </BaseModal>
  );
};
