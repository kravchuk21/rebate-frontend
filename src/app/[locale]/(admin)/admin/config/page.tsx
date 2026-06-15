import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { ConfigEditor } from '@/features/admin/components/config/ConfigEditor';

export default async function AdminConfigPage() {
  const t = await getTranslations('admin.config');

  return (
    <div className="flex flex-col gap-6">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <ConfigEditor />
    </div>
  );
}
