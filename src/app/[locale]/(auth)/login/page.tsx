import { Alert } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { registered } = await searchParams;
  const t = await getTranslations('auth.login');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  return (
    <div className="flex flex-col gap-4">
      {registered === 'true' && (
        <Alert status="success">
          <Alert.Content>
            <Alert.Description>{t('registeredSuccess')}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <LoginForm />

      <p className="text-center text-sm">
        {t('noAccount')}{' '}
        <Link href="/register" className="underline">
          {t('register')}
        </Link>
      </p>

      <a href={`${apiUrl}/auth/google`} className="text-center text-sm underline">
        {t('googleLogin')}
      </a>
    </div>
  );
}
