import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { setAuthCookies } from '@/shared/lib/cookies';

const API_URL = process.env.API_URL ?? 'http://localhost:8080';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  if (data.data?.['2fa_required']) {
    return NextResponse.json(data);
  }

  const accessToken = data.data?.access_token;
  const refreshToken = data.data?.refresh_token;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Invalid response from server' }, { status: 500 });
  }

  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json({ success: true });
}
