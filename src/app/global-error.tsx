"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex max-w-md flex-col gap-4 text-center">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted text-sm">An unexpected error occurred. Please try again.</p>
            {error.digest && (
              <p className="text-muted font-mono text-xs">Error ID: {error.digest}</p>
            )}
            <button onClick={reset} className="bg-primary rounded px-4 py-2 text-white">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
