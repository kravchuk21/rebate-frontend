import { Typography } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { UsersTable } from '@/features/admin/components/users/UsersTable';

export default async function AdminUsersPage() {
  const t = await getTranslations('admin.users');

  return (
    <div className="flex flex-col gap-6">
      <Typography.Heading>{t('title')}</Typography.Heading>
      <UsersTable />
    </div>
  );
}
