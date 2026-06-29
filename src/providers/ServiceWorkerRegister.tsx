"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker (/sw.js) once on mount. Renders nothing.
 * `updateViaCache: "none"` makes the browser always revalidate the worker
 * script so deploys ship a fresh worker instead of a stale cached one.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    // Skip in development: the worker intercepts navigations and caches the
    // offline page, which fights HMR and confuses local debugging.
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  }, []);

  return null;
}
