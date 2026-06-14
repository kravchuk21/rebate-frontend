import { Separator, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

interface AuthDividerProps {
  translationKey?: string;
}

export const AuthDivider = ({ translationKey = 'auth.login.or' }: AuthDividerProps) => {
  const t = useTranslations();

  return (
    <div className="flex w-full items-center gap-2">
      <Separator className="flex-1" />
      <Typography.Paragraph color="muted" size="xs" className="uppercase">
        {t(translationKey)}
      </Typography.Paragraph>
      <Separator className="flex-1" />
    </div>
  );
};
