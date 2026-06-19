import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { buildForwardCookieHeader, forwardSetCookieHeaders } from "@/shared/lib/proxyAuth";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Cookie: buildForwardCookieHeader(request),
    },
  }).catch(() => undefined);

  const nextRes = NextResponse.json(
    { success: true },
    { status: res && res.status !== 204 ? res.status : 200 },
  );

  if (res) {
    forwardSetCookieHeaders(res, nextRes);
  }

  return nextRes;
}
