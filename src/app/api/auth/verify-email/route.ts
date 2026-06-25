import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/shared/lib/env";

const API_URL = env.API_URL;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
