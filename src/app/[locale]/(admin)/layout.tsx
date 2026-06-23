import type { Metadata } from "next";
import { redirect } from "@/i18n/navigation";
import { getAccessToken } from "@/shared/lib/cookies";
import { decodeAccessToken } from "@/shared/lib/decodeToken";
import { Routes } from "@/shared/lib/routes";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { SidebarProvider } from "@/shared/components/dashboard/SidebarContext";
import { PageTransition } from "@/shared/components/PageTransition";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
    redirect({ href: `${Routes.Home}?modal=login`, locale });
    return;
  }

  const claims = decodeAccessToken(token);

  if (!claims || claims.role !== "admin") {
    redirect({ href: Routes.Dashboard, locale });
    return;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar email={claims.email} role={claims.role} />
        <main className="flex flex-1 flex-col gap-6 p-4">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </SidebarProvider>
  );
}
