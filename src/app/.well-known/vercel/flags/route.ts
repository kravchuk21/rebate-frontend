import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import * as flags from "@/shared/flags";

/**
 * Vercel Toolbar discovery endpoint.
 *
 * Publishes the app's flag definitions so they can be inspected and overridden
 * from the Vercel Toolbar in preview/development. Requires the `FLAGS_SECRET`
 * environment variable. See https://flags-sdk.dev/concepts/discovery-endpoint.
 */
export const GET = createFlagsDiscoveryEndpoint(async () => getProviderData(flags));
