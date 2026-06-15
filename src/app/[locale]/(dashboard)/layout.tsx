import { redirect } from '@/i18n/navigation';
import { getAccessToken } from '@/shared/lib/cookies';
import { decodeAccessToken } from '@/shared/lib/decodeToken';
import { Sidebar } from '@/shared/components/dashboard/Sidebar';
import { SidebarProvider } from '@/shared/components/dashboard/SidebarContext';

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

  const claims = decodeAccessToken(accessToken!);

  if (!claims) {
    redirect({ href: '/?modal=login', locale });
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar email={claims!.email} role={claims!.role} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
