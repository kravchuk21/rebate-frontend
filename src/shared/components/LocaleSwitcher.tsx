'use client';

import {useTransition} from 'react';
import {useLocale} from 'next-intl';
import {ListBox, Select} from '@heroui/react';

import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import type {Key} from 'react';


export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: Key | null) => {
    if (value == null) return;
  
    const nextLocale = value.toString();
  
    if (nextLocale === locale) return;
  
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  };

  return (
    <Select
      className="w-[256px]"
      value={locale}
      onChange={handleChange}
      isDisabled={isPending}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        <ListBox>
          {routing.locales.map((cur) => (
            <ListBox.Item key={cur} id={cur} textValue={cur.toUpperCase()}>
              {cur.toUpperCase()}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};