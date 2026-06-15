'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center flex flex-col gap-4 max-w-md">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted text-sm">
              An unexpected error occurred. Please try again.
            </p>
            {error.digest && (
              <p className="text-xs text-muted font-mono">Error ID: {error.digest}</p>
            )}
            <button onClick={reset} className="px-4 py-2 bg-primary text-white rounded">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
