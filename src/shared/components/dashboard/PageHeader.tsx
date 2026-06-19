import { Typography } from "@heroui/react";

import { SidebarToggle } from "./SidebarToggle";

interface PageHeaderProps {
  title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => (
  <div className="flex items-center gap-4">
    <SidebarToggle />
    <Typography type="h4">{title}</Typography>
  </div>
);
