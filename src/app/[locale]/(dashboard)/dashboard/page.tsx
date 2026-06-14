import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div className="p-8">
      <Typography.Heading>{t('title')}</Typography.Heading>
    </div>
  );
}
