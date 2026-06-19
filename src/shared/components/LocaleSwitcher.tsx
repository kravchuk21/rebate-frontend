'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { Button, ButtonGroup } from '@heroui/react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <ButtonGroup fullWidth size="sm" variant="outline" isDisabled={isPending}>
      {routing.locales.map((cur, index) => (
        <Button
          key={cur}
          // variant={cur === locale ? 'secondary' : 'tertiary'}
          onPress={() => handleChange(cur)}
        >
          {index > 0 && <ButtonGroup.Separator />}
          {cur.toUpperCase()}
        </Button>
      ))}
    </ButtonGroup>
  );
};