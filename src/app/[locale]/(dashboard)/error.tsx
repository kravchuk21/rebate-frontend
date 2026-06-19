'use client';

import { useEffect } from 'react';
import { Button, Typography, buttonVariants } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Routes } from '@/shared/lib/routes';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard route error:', error);
  }, [error]);

  const t = useTranslations('errors');

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center flex flex-col items-center gap-4 max-w-md">
        <Typography.Heading>{t('title')}</Typography.Heading>
        <p className="text-muted text-sm">{t('description')}</p>
        {error.digest && (
          <p className="text-xs text-muted font-mono">
            {t('errorId')}: {error.digest}
          </p>
        )}
        <div className="flex gap-3">
          <Button variant="primary" onPress={reset}>
            {t('tryAgain')}
          </Button>
          <Link href={Routes.Dashboard} className={buttonVariants({ variant: 'tertiary' })}>
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
