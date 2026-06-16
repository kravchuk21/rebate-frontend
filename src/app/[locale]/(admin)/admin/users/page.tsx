import { PageHeader } from '@/shared/components/dashboard/PageHeader';
import { getTranslations } from 'next-intl/server';

import { UsersTable } from '@/features/admin/components/users/UsersTable';

export default async function AdminUsersPage() {
  const t = await getTranslations('admin.users');

  return (
    <>
      <PageHeader title={t('title')} />
      <UsersTable />
    </>
  );
}
