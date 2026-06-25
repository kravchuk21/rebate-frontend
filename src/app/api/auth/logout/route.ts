import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildForwardCookieHeader, forwardSetCookieHeaders } from "@/shared/lib/proxyAuth";
import { env } from "@/shared/lib/env";

const API_URL = env.API_URL;

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
