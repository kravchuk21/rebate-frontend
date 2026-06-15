'use client';

import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/shared/components/LocaleSwitcher';
import { useLogout } from '@/features/auth/hooks/useLogout';

export const AdminHeader = () => {
  const t = useTranslations('common');
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between border-b p-4">
      <span className="font-semibold">Admin Panel</span>
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        <Button
          variant="outline"
          size="sm"
          onPress={() => logout.mutate()}
          isDisabled={logout.isPending}
        >
          {t('logout')}
        </Button>
      </div>
    </header>
  );
};
