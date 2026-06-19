'use client';

import { Drawer } from '@heroui/react';
import { AnimatePresence, motion } from 'motion/react';

import { SidebarFooter } from './SidebarFooter';
import { SidebarNav, type SidebarNavItem } from './SidebarNav';
import { SidebarUserProfile } from './SidebarUserProfile';
import { useSidebar } from './SidebarContext';

interface SidebarShellProps {
  email: string;
  role: string;
  items: readonly SidebarNavItem[];
  ariaLabel: string;
}

export const SidebarShell = ({ email, role, items, ariaLabel }: SidebarShellProps) => {
  const { drawer, isDesktopVisible } = useSidebar();

  const content = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-4">
      <SidebarUserProfile email={email} role={role} />
      <SidebarNav items={items} ariaLabel={ariaLabel} onNavigate={onNavigate} />
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

      <AnimatePresence initial={false}>
        {isDesktopVisible && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r md:block"
          >
            <div className="h-full w-72 p-4">{content()}</div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
