'use client';

import { Drawer } from '@heroui/react';

import { SidebarFooter } from './SidebarFooter';
import { SidebarNav } from './SidebarNav';
import { SidebarUserProfile } from './SidebarUserProfile';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
  email: string;
  role: string;
}

export const Sidebar = ({ email, role }: SidebarProps) => {
  const { drawer, isDesktopVisible } = useSidebar();

  const content = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-4">
      <SidebarUserProfile email={email} role={role} />
      <SidebarNav onNavigate={onNavigate} />
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
