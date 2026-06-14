import { cookies } from 'next/headers';

export const COOKIE_NAMES = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
} as const;

export const ACCESS_TOKEN_MAX_AGE = 60 * 15;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const getAccessToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.accessToken)?.value;
};

export const getRefreshToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.refreshToken)?.value;
};

export const setAuthCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAMES.accessToken, accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(COOKIE_NAMES.refreshToken, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

export const clearAuthCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.accessToken);
  cookieStore.delete(COOKIE_NAMES.refreshToken);
};
