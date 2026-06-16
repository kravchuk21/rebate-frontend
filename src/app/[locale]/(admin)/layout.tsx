import { redirect } from '@/i18n/navigation';
import { getAccessToken } from '@/shared/lib/cookies';
import { decodeAccessToken } from '@/shared/lib/decodeToken';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';
import { SidebarProvider } from '@/shared/components/dashboard/SidebarContext';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const token = await getAccessToken();

  if (!token) {
    redirect({ href: '/?modal=login', locale });
    return;
  }

  const claims = decodeAccessToken(token);

  if (!claims || claims.role !== 'admin') {
    redirect({ href: '/dashboard', locale });
    return;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar email={claims.email} role={claims.role} />
        <main className="flex-1 flex flex-col gap-6 p-5">{children}</main>
      </div>
    </SidebarProvider>
  );
}
