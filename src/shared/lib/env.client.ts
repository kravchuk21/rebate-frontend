import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_SITE_URL: z.url(),
});

const parsedClientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsedClientEnv.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsedClientEnv.error)}`);
}

export const clientEnv = parsedClientEnv.data;
