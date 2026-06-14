'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex gap-2">
      {routing.locales.map((cur) => (
        <button
          key={cur}
          type="button"
          disabled={isPending || cur === locale}
          onClick={() => onChange(cur)}
          className={cur === locale ? 'font-bold underline' : 'opacity-70 hover:opacity-100'}
        >
          {cur.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
