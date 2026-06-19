import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { forwardSetCookieHeaders } from "@/shared/lib/proxyAuth";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  if (data.data?.["2fa_required"]) {
    return NextResponse.json(data);
  }

  const nextRes = NextResponse.json(data);
  forwardSetCookieHeaders(res, nextRes);
  return nextRes;
}
