'use client';

import { useEffect, useState } from 'react';
import { InputOTP, Link, toast, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { getErrorMessage } from '../lib/getErrorMessage';
import { useAuthModal } from '../hooks/useAuthModal';
import { useTwoFAVerify } from '../hooks/useTwoFAVerify';

export const TwoFAModal = () => {
  const t = useTranslations();
  const { userId, open } = useAuthModal();
  const verify = useTwoFAVerify();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (code.length === 6 && userId && !verify.isPending) {
      verify.mutate(
        { user_id: userId, code },
        {
          onError: (error) => {
            setCode('');
            toast.danger(getErrorMessage(error) ?? t('twoFA.errors.generic'));
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if (!userId) {
      toast.danger(t('twoFA.invalidSession'));
      open('login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Typography type="h4">{t('twoFA.title')}</Typography>
        <Typography.Paragraph size="sm" color="muted">
          {t('twoFA.subtitle')}
        </Typography.Paragraph>
      </div>

      <InputOTP
        variant='secondary'
        maxLength={6}
        value={code}
        onChange={setCode}
        isDisabled={verify.isPending}
        isInvalid={verify.isError}
      >
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>

      <Typography.Paragraph size="sm" align="center">
        <Link onPress={() => open('login')}>{t('twoFA.backToLogin')}</Link>
      </Typography.Paragraph>
    </div>
  );
};
