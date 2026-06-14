'use client';

import { Button } from '@heroui/react';
import { useAuthModal } from '../hooks/useAuthModal';
import { useTranslations } from 'next-intl';

export const AuthModalTrigger = () => {
  const { open } = useAuthModal();
  const t = useTranslations('landing');

  return (
    <div className="flex gap-3">
      <Button variant="tertiary" onPress={() => open('login')}>
        {t('signIn')}
      </Button>
      <Button variant="primary" onPress={() => open('register')}>
        {t('getStarted')}
      </Button>
    </div>
  );
};
