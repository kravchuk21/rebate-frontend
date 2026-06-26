import { Skeleton } from "@heroui/react";

import { DashboardLayout, DashboardItem } from "@/shared/components/layout";
import { WidgetCard } from "@/shared/components/WidgetCard";

/**
 * Route-level loading shell for the dashboard and admin groups.
 *
 * Rendered by each group's `loading.tsx` as the Suspense fallback while the
 * page's Server Component streams in. It mirrors the real page chrome — a
 * header row and a grid of widget cards — so navigation paints an instant,
 * stable layout instead of an empty `<main>`. Pure Server Component: no hooks,
 * no client bundle.
 */
export const PageSkeleton = () => (
  <>
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-7 w-48" />
    </div>
    <DashboardLayout>
      {Array.from({ length: 4 }).map((_, i) => (
        <DashboardItem key={i} span={6}>
          <WidgetCard>
            <div className="flex flex-col gap-3 p-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </WidgetCard>
        </DashboardItem>
      ))}
    </DashboardLayout>
  </>
);
