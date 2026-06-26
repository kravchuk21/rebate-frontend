import "server-only";
// Importing the hand-written instance module sets `instance.baseURL` and
// registers the request/response interceptors. Its cookie/`window` access is
// guarded by `typeof document === "undefined"`, so it safely no-ops on the
// server — we attach the auth header explicitly via `authRequest()` instead.
import "@/shared/api/instance";

import {
  QueryClient,
  dehydrate,
  type DehydratedState,
  type FetchQueryOptions,
} from "@tanstack/react-query";

import { getAccessToken } from "@/shared/lib/cookies";

/** Per-call auth, spread into a generated factory as its `request` setting. */
export type AuthRequest = { config: { headers: { Authorization: string } } } | undefined;

export const authRequest = async (): Promise<AuthRequest> => {
  const token = await getAccessToken();
  return token ? { config: { headers: { Authorization: `Bearer ${token}` } } } : undefined;
};

/**
 * Prefetch authed queries on the server and return an RSC-safe dehydrated cache
 * for a `<HydrationBoundary>`.
 *
 * `build` receives the resolved auth `request` and returns the list of generated
 * `getXQueryOptions({ request })` to prefetch. The query keys ignore `config`, so
 * they match the no-arg client hooks exactly and hydrate them on first paint.
 *
 * The cached value is the full fetches response object, which may carry non-plain
 * fields. `HydrationBoundary` serializes its `state` prop across the RSC boundary,
 * and a non-plain value would throw at render — so we force the dehydrated state
 * to plain JSON. The widgets only read `.data`, which survives. A failed prefetch
 * is swallowed by TanStack Query, so the client simply refetches as it does today.
 */
export const prefetchAuthed = async (
  // Generated `getXQueryOptions(...)` returns are strongly typed per endpoint and
  // don't unify across a heterogeneous array, so accept the loose shape and cast
  // at the prefetch call — the query key is all that matters for hydration.
  build: (request: AuthRequest) => readonly unknown[],
): Promise<DehydratedState> => {
  const request = await authRequest();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });

  await Promise.all(
    build(request).map((options) => queryClient.prefetchQuery(options as FetchQueryOptions)),
  );

  return JSON.parse(JSON.stringify(dehydrate(queryClient))) as DehydratedState;
};
