import { Tray } from "@gravity-ui/icons";
import { EmptyState, Typography } from "@heroui/react";

interface TableEmptyStateProps {
  label: string;
}

export const TableEmptyState = ({ label }: TableEmptyStateProps) => (
  <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 py-12 text-center">
    <Tray className="size-6" />
    <Typography.Paragraph size="sm" color="muted">
      {label}
    </Typography.Paragraph>
  </EmptyState>
);
