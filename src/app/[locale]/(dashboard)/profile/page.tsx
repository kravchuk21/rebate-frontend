import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/shared/components/dashboard/PageHeader';

import { redirect } from '@/i18n/navigation';
import { getAccessToken } from '@/shared/lib/cookies';
import { decodeAccessToken } from '@/shared/lib/decodeToken';
import { ChangePasswordSection } from '@/features/auth/components/profile/ChangePasswordSection';
import { ProfileAccountInfo } from '@/features/auth/components/profile/ProfileAccountInfo';
import { TwoFASection } from '@/features/auth/components/profile/TwoFASection';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const token = await getAccessToken();

  if (!token) {
    redirect({ href: '/?modal=login', locale });
    return;
  }

  const claims = decodeAccessToken(token);

  if (!claims) {
    redirect({ href: '/?modal=login', locale });
    return;
  }

  const t = await getTranslations('profile');

  return (
    <>
      <PageHeader title={t('title')} />
      <ProfileAccountInfo email={claims.email} role={claims.role} />
      <TwoFASection initialEnabled={claims.two_fa_enabled ?? false} />
      <ChangePasswordSection />
    </>
  );
}
