export function forwardSetCookieHeaders(goResponse: Response, nextResponse: Response): void {
  const setCookieHeaders =
    goResponse.headers.getSetCookie?.() ??
    goResponse.headers.get("set-cookie")?.split(/,(?=[^;]+=)/) ??
    [];

  for (const cookie of setCookieHeaders) {
    nextResponse.headers.append("Set-Cookie", cookie);
  }
}

export function buildForwardCookieHeader(request: Request): string {
  return request.headers.get("cookie") ?? "";
}
