'use client';

import { useTranslations } from 'next-intl';
import { Drawer } from '@heroui/react';

import { SidebarFooter } from '@/shared/components/dashboard/SidebarFooter';
import { SidebarNav } from '@/shared/components/dashboard/SidebarNav';
import { SidebarUserProfile } from '@/shared/components/dashboard/SidebarUserProfile';
import { useSidebar } from '@/shared/components/dashboard/SidebarContext';

const ADMIN_NAV_KEYS = [
  { href: '/admin', labelKey: 'overview' },
  { href: '/admin/users', labelKey: 'users' },
  { href: '/admin/broker-accounts', labelKey: 'brokerAccounts' },
  { href: '/admin/withdrawals', labelKey: 'withdrawals' },
  { href: '/admin/rebate', labelKey: 'rebate' },
  { href: '/admin/config', labelKey: 'config' },
  { href: '/admin/audit-log', labelKey: 'auditLog' },
] as const;

interface AdminSidebarProps {
  email: string;
  role: string;
}

export const AdminSidebar = ({ email, role }: AdminSidebarProps) => {
  const t = useTranslations('admin.nav');
  const { drawer, isDesktopVisible } = useSidebar();

  const items = ADMIN_NAV_KEYS.map((item) => ({ href: item.href, label: t(item.labelKey) }));

  const content = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-4">
      <SidebarUserProfile email={email} role={role} />
      <SidebarNav items={items} ariaLabel="Admin navigation" onNavigate={onNavigate} />
      <div className="mt-auto">
        <SidebarFooter />
      </div>
    </div>
  );

  return (
    <>
      <Drawer.Root state={drawer}>
        <Drawer.Backdrop className="md:hidden">
          <Drawer.Content placement="left" className="w-72">
            <Drawer.Dialog className="p-4">
              <Drawer.Body>{content(drawer.close)}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer.Root>

      {isDesktopVisible && (
        <aside className="hidden w-72 border-r p-4 md:block">{content()}</aside>
      )}
    </>
  );
};
