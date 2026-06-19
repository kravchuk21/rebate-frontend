import { Suspense } from 'react';
import { redirect } from '@/i18n/navigation';
import { getAccessToken } from '@/shared/lib/cookies';
import { Routes } from '@/shared/lib/routes';
import { LandingClient } from '@/features/landing/components/LandingClient';

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ modal?: string; ref?: string }>;
}) {
  const { locale } = await params;
  const token = await getAccessToken();

  if (token) {
    redirect({ href: Routes.Dashboard, locale });
  }

  const { ref } = await searchParams;

  return (
    <Suspense fallback={null}>
      <LandingClient defaultReferralCode={ref} />
    </Suspense>
  );
}
