import { cn } from "@/shared/lib/cn";

const GAP: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

type Props = {
  children: React.ReactNode;
  gap?: keyof typeof GAP;
  className?: string;
};

export function DashboardLayout({ children, gap = 4, className }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-12",
        GAP[gap] ?? "gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
