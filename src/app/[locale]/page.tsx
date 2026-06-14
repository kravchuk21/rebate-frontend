import { redirect } from '@/i18n/navigation';
import { getAccessToken } from '@/shared/lib/cookies';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const accessToken = await getAccessToken();

  redirect({ href: accessToken ? '/dashboard' : '/login', locale });
}
