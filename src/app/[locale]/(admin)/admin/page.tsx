import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

export default async function AdminOverviewPage() {
  const locale = await getLocale();

  redirect({
    href: { pathname: '/admin/users' },
    locale: locale
  });

  return null;
}