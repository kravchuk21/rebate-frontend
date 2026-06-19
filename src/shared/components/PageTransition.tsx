'use client';

import { ViewTransition } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Animates the dashboard/admin content area on route changes.
 *
 * The `key={pathname}` is what makes this work: a ViewTransition only fires
 * its `enter`/`exit` animations when the boundary mounts/unmounts. A boundary
 * placed directly in a layout persists across navigations (only `children`
 * swaps), so React would treat it as an "update" and skip enter/exit. Keying
 * on the pathname forces an unmount + remount on each route change, which
 * triggers exit on the old page and enter on the new one.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="dashboard-content-in" exit="dashboard-content-out">
      {children}
    </ViewTransition>
  );
}
