import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { ref } = await searchParams;
  const referralCode = typeof ref === 'string' ? ref : undefined;
  const t = await getTranslations('auth.register');

  return (
    <div className="flex flex-col gap-4">
      <RegisterForm defaultReferralCode={referralCode} />

      <p className="text-center text-sm">
        {t('hasAccount')}{' '}
        <Link href="/login" className="underline">
          {t('login')}
        </Link>
      </p>
    </div>
  );
}
