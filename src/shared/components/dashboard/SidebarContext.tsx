'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useOverlayState, type UseOverlayStateReturn } from '@heroui/react';

interface SidebarContextValue {
  drawer: UseOverlayStateReturn;
  isDesktopVisible: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const DESKTOP_QUERY = '(min-width: 768px)';

const getInitialIsDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const drawer = useOverlayState();
  const [isDesktopVisible, setDesktopVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(getInitialIsDesktop);

  // Keep latest drawer/isDesktop available to the stable `toggle` callback without
  // making `toggle` (and therefore the context value) change identity every render.
  const drawerRef = useRef(drawer);
  const isDesktopRef = useRef(isDesktop);

  useEffect(() => {
    drawerRef.current = drawer;
    isDesktopRef.current = isDesktop;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);

      if (event.matches) {
        drawerRef.current.close();
      }
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    if (isDesktopRef.current) {
      setDesktopVisible((prev) => !prev);
    } else {
      drawerRef.current.toggle();
    }
  }, []);

  const value = useMemo(
    () => ({ drawer, isDesktopVisible, toggle }),
    [drawer, isDesktopVisible, toggle],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);

  if (!ctx) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return ctx;
};
