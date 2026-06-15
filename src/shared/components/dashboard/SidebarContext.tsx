'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useOverlayState, type UseOverlayStateReturn } from '@heroui/react';

interface SidebarContextValue {
  drawer: UseOverlayStateReturn;
  isDesktopVisible: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const DESKTOP_QUERY = '(min-width: 768px)';

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const drawer = useOverlayState();
  const [isDesktopVisible, setDesktopVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);

      if (event.matches) {
        drawer.close();
      }
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, [drawer]);

  const toggle = useCallback(() => {
    if (isDesktop) {
      setDesktopVisible((prev) => !prev);
    } else {
      drawer.toggle();
    }
  }, [drawer, isDesktop]);

  return (
    <SidebarContext.Provider value={{ drawer, isDesktopVisible, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);

  if (!ctx) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return ctx;
};
