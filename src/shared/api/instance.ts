import type { ResponseError, RequestConfig } from '@siberiacancode/fetches';

import { instance } from '@/shared/api/generated/instance.gen';

(instance as { baseURL: string }).baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const getAccessTokenFromCookie = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;

  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
};

instance.interceptors.response.use((response) => {
  const body = response.data as unknown;

  if (body && typeof body === 'object' && 'data' in body) {
    response.data = (body as { data: unknown }).data as typeof response.data;
  }

  return response;
});

instance.interceptors.request.use((config) => {
  const accessToken = getAccessTokenFromCookie();

  if (accessToken) {
    config.headers = {
      ...(config.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(accessToken: string) => void> = [];

const redirectToLogin = () => {
  refreshQueue = [];
  if (typeof window !== 'undefined') {
    window.location.href = '/?modal=login';
  }
};

instance.interceptors.response.use(undefined, async (error: ResponseError) => {
  const request = error.request as RequestConfig & { _retry?: boolean };

  if (error.response?.status !== 401 || request._retry) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push((accessToken) => {
        request._retry = true;
        request.headers = {
          ...(request.headers as Record<string, string> | undefined),
          Authorization: `Bearer ${accessToken}`,
        };
        instance.call(request.method, request.url, request).then(resolve, reject);
      });
    });
  }

  request._retry = true;
  isRefreshing = true;

  try {
    const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });

    if (!refreshResponse.ok) {
      throw new Error('Refresh failed');
    }

    const newAccessToken = getAccessTokenFromCookie();

    if (!newAccessToken) {
      throw new Error('Invalid refresh response');
    }

    refreshQueue.forEach((callback) => callback(newAccessToken));
    refreshQueue = [];

    request.headers = {
      ...(request.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${newAccessToken}`,
    };
    return instance.call(request.method, request.url, request);
  } catch {
    redirectToLogin();
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
});
