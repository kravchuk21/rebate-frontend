import { cn } from "@/shared/lib/cn";

const SPAN: Record<number, string> = {
  1: "@3xl:col-span-1",
  2: "@3xl:col-span-2",
  3: "@3xl:col-span-3",
  4: "@3xl:col-span-4",
  5: "@3xl:col-span-5",
  6: "@3xl:col-span-6",
  7: "@3xl:col-span-7",
  8: "@3xl:col-span-8",
  9: "@3xl:col-span-9",
  10: "@3xl:col-span-10",
  11: "@3xl:col-span-11",
  12: "@3xl:col-span-12",
};

type Span = keyof typeof SPAN;

type Props = {
  children: React.ReactNode;
  span?: Span;
  className?: string;
};

export function DashboardItem({ children, span = 12, className }: Props) {
  return <div className={cn("col-span-1", SPAN[span], className)}>{children}</div>;
}
