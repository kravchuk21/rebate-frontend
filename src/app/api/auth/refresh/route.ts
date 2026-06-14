import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { buildForwardCookieHeader, forwardSetCookieHeaders } from '@/shared/lib/proxyAuth';

const API_URL = process.env.API_URL ?? 'http://localhost:8080';

export async function POST(request: NextRequest) {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: buildForwardCookieHeader(request),
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Refresh failed' }));
    const nextRes = NextResponse.json(errData, { status: 401 });
    forwardSetCookieHeaders(res, nextRes);
    return nextRes;
  }

  const data = await res.json();
  const nextRes = NextResponse.json(data);
  forwardSetCookieHeaders(res, nextRes);
  return nextRes;
}
