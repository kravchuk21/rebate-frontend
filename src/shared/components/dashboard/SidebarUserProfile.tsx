import { Avatar, Typography } from '@heroui/react';
import { Link } from '@/i18n/navigation';

interface SidebarUserProfileProps {
  email: string;
  role: string;
}

export const SidebarUserProfile = ({ email, role }: SidebarUserProfileProps) => {
  const initial = email.charAt(0).toUpperCase();

  return (
    <Link href="/profile" className="flex items-center gap-3">
      <Avatar>
        <Avatar.Image
          alt="Avatar"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
        />
        <Avatar.Fallback>{initial}</Avatar.Fallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <Typography.Paragraph size="sm" truncate>
          {email}
        </Typography.Paragraph>
        <Typography.Paragraph size="xs" color="muted" className="capitalize">
          {role}
        </Typography.Paragraph>
      </div>
    </Link>
  );
};
