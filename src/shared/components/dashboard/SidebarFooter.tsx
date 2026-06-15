'use client';

import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ArrowRightFromSquare } from '@gravity-ui/icons';

import { LocaleSwitcher } from '@/shared/components/LocaleSwitcher';
import { useLogout } from '@/features/auth/hooks/useLogout';

export const SidebarFooter = () => {
  const t = useTranslations('common');
  const logout = useLogout();

  return (
    <div className="flex flex-col gap-1">
      <LocaleSwitcher />
      <Button
        variant="tertiary"
        fullWidth
        size="sm"
        onPress={() => logout.mutate()}
        isDisabled={logout.isPending}
      >
        <ArrowRightFromSquare />
        {t('logout')}
      </Button>
    </div>
  );
};
