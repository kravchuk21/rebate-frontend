import { memo } from "react";
import { Avatar, Typography } from "@heroui/react";
import { Link } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";

interface SidebarUserProfileProps {
  email: string;
  role: string;
}

export const SidebarUserProfile = memo(function SidebarUserProfile({
  email,
  role,
}: SidebarUserProfileProps) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <Link href={Routes.Profile} className="flex items-center gap-3 px-1">
      <Avatar size="sm">
        <Avatar.Image
          alt="Avatar"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
        />
        <Avatar.Fallback>{initial}</Avatar.Fallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <Typography.Paragraph size="sm" truncate className="leading-tight">
          {email}
        </Typography.Paragraph>
        <Typography.Paragraph size="xs" color="muted" className="capitalize leading-tight">
          {role}
        </Typography.Paragraph>
      </div>
    </Link>
  );
});
