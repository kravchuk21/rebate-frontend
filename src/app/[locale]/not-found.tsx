import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@heroui/react';

import { Link } from '@/i18n/navigation';
import { Routes } from '@/shared/lib/routes';

export default async function NotFound() {
  const t = await getTranslations('errors');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-4">
        <p className="text-8xl font-bold text-muted">404</p>
        <h1 className="text-2xl font-semibold">{t('notFound')}</h1>
        <p className="text-muted text-sm">{t('notFoundDesc')}</p>
        <Link href={Routes.Dashboard} className={buttonVariants({ variant: 'primary' })}>
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}
