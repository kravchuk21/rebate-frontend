import { NextResponse } from 'next/server';

import { clearAuthCookies, getRefreshToken, setAuthCookies } from '@/shared/lib/cookies';

const API_URL = process.env.API_URL ?? 'http://localhost:8080';

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthCookies();
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json();

  const accessToken = data.data?.access_token;
  const newRefreshToken = data.data?.refresh_token;

  if (!res.ok || !accessToken || !newRefreshToken) {
    await clearAuthCookies();
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
  }

  await setAuthCookies(accessToken, newRefreshToken);

  return NextResponse.json({ success: true });
}
