"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { TokenClaims } from "@/shared/lib/decodeToken";

export interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  email: string | null;
}

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  role: null,
  email: null,
});

interface AuthProviderProps {
  /** JWT claims decoded server-side, or `null` for an anonymous visitor. */
  claims: Pick<TokenClaims, "role" | "email"> | null;
  children: ReactNode;
}

/**
 * Single source of truth for the current user's identity on the client. Seeded
 * once from the server-decoded JWT in `app/[locale]/layout.tsx`. Consumed by
 * `useModal` to gate access to modals (defense-in-depth on top of the server
 * route guards).
 */
export const AuthProvider = ({ claims, children }: AuthProviderProps) => {
  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated: claims !== null,
      role: claims?.role ?? null,
      email: claims?.email ?? null,
    }),
    [claims],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => useContext(AuthContext);
