import { redirect } from '@/i18n/navigation';
import { getAccessToken } from '@/shared/lib/cookies';
import { LocaleSwitcher } from '@/shared/components/LocaleSwitcher';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect({ href: '/login', locale });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-end p-4">
        <LocaleSwitcher />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
