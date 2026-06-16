'use client';

import { useTranslations } from 'next-intl';
import { Drawer } from '@heroui/react';

import { SidebarFooter } from './SidebarFooter';
import { SidebarNav } from './SidebarNav';
import { SidebarUserProfile } from './SidebarUserProfile';
import { useSidebar } from './SidebarContext';

const NAV_KEYS = [
  { href: '/dashboard', labelKey: 'dashboard' },
  { href: '/accounts', labelKey: 'accounts' },
  { href: '/rebate', labelKey: 'rebate' },
  { href: '/withdrawal', labelKey: 'withdrawal' },
  { href: '/referrals', labelKey: 'referrals' },
  { href: '/profile', labelKey: 'profile' },
] as const;

interface SidebarProps {
  email: string;
  role: string;
}

export const Sidebar = ({ email, role }: SidebarProps) => {
  const t = useTranslations('nav');
  const { drawer, isDesktopVisible } = useSidebar();

  const items = NAV_KEYS.map((item) => ({ href: item.href, label: t(item.labelKey) }));

  const content = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-4">
      <SidebarUserProfile email={email} role={role} />
      <SidebarNav items={items} ariaLabel="Dashboard navigation" onNavigate={onNavigate} />
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
