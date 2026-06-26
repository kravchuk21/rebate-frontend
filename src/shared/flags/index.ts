import { flag } from "flags/next";

/**
 * Feature flags, powered by the Vercel `flags` SDK (https://flags-sdk.dev).
 *
 * Each flag is evaluated on the server. Resolution order per flag:
 *   1. Vercel Toolbar override (preview/dev only, requires `FLAGS_SECRET`).
 *   2. Environment variable override (e.g. `FLAG_BLOG=false`).
 *   3. The hard-coded `defaultValue` below.
 *
 * To add a flag: declare it with `booleanFlag(...)` and export it. It is then
 * automatically published to the Vercel Toolbar via the discovery endpoint at
 * `src/app/.well-known/vercel/flags/route.ts`.
 *
 * Consume a flag from any Server Component / Route Handler:
 *   const enabled = await blogFlag();
 */

interface BooleanFlagOptions {
  /** Stable, kebab-case identifier shown in the Vercel Toolbar. */
  key: string;
  /** Human-readable explanation surfaced in the Vercel Toolbar. */
  description: string;
  /** Value used when no override is present. */
  defaultValue: boolean;
  /** Optional env var that overrides the default (`"true"`/`"1"` ⇒ on). */
  envVar?: string;
}

function booleanFlag({ key, description, defaultValue, envVar }: BooleanFlagOptions) {
  return flag<boolean>({
    key,
    description,
    defaultValue,
    options: [
      { value: false, label: "Off" },
      { value: true, label: "On" },
    ],
    decide() {
      if (envVar) {
        const raw = process.env[envVar];
        if (raw != null) return raw === "true" || raw === "1";
      }
      return defaultValue;
    },
  });
}

export const referralProgramFlag = booleanFlag({
  key: "referral-program",
  description: "Enables the referral program dashboard and link sharing.",
  defaultValue: true,
  envVar: "FLAG_REFERRAL_PROGRAM",
});
