import { loadEnvConfig } from "@next/env";
import { z } from "zod";

loadEnvConfig(process.cwd());

const envSchema = z.object({
  API_URL: z.url(),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_SITE_URL: z.url(),
  // Used to sign Vercel Toolbar flag overrides. Optional: without it, flags
  // still resolve from env vars / defaults, but Toolbar overrides are disabled.
  FLAGS_SECRET: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsedEnv.error)}`);
}

export const env = parsedEnv.data;
