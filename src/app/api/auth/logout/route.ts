import { NextResponse } from 'next/server';

import { clearAuthCookies, getRefreshToken } from '@/shared/lib/cookies';

const API_URL = process.env.API_URL ?? 'http://localhost:8080';

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => undefined);
  }

  await clearAuthCookies();

  return NextResponse.json({ success: true });
}
