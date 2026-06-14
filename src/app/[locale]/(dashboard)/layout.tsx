import { redirect } from '@/i18n/navigation';
import { getAccessToken } from '@/shared/lib/cookies';
import { DashboardHeader } from '@/shared/components/dashboard/DashboardHeader';
import { Sidebar } from '@/shared/components/dashboard/Sidebar';

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
    redirect({ href: '/?modal=login', locale });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
