import { cookies } from "next/headers";

export const COOKIE_NAMES = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const;

export const getAccessToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.accessToken)?.value;
};

export const clearAuthCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.accessToken);
  cookieStore.delete(COOKIE_NAMES.refreshToken);
};
