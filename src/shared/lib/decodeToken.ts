export interface TokenClaims {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export const decodeAccessToken = (token: string): TokenClaims | null => {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    return payload as TokenClaims;
  } catch {
    return null;
  }
};
