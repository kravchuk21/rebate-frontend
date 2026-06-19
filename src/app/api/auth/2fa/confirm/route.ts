import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getAccessToken } from "@/shared/lib/cookies";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/auth/2fa/confirm`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
