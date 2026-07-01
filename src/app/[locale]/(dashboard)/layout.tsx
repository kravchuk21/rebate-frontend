import type { Metadata } from "next";
import { redirect } from "@/i18n/navigation";
import { getAccessToken } from "@/shared/lib/cookies";
import { decodeAccessToken } from "@/shared/lib/decodeToken";
import { Routes } from "@/shared/lib/routes";
import { Sidebar } from "@/shared/components/dashboard/Sidebar";
import { SidebarProvider } from "@/shared/components/dashboard/SidebarContext";
import { PageTransition } from "@/shared/components/PageTransition";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
    redirect({ href: `${Routes.Home}?modal=login`, locale });
  }

  const claims = decodeAccessToken(accessToken!);

  if (!claims) {
    redirect({ href: `${Routes.Home}?modal=login`, locale });
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar email={claims!.email} role={claims!.role} />
        <main className="flex flex-1 flex-col gap-4 p-4">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </SidebarProvider>
  );
}
