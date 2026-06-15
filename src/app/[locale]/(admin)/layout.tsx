import { redirect } from '@/i18n/navigation';
import { getAccessToken } from '@/shared/lib/cookies';
import { AdminHeader } from '@/features/admin/components/AdminHeader';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';

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

  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());

    if (payload.role !== 'admin') {
      redirect({ href: '/dashboard', locale });
    }
  } catch {
    redirect({ href: '/?modal=login', locale });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
