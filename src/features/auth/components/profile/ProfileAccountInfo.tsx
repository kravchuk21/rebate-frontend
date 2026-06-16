'use client';

import { Card, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

interface ProfileAccountInfoProps {
  email: string;
  role: string;
}

export const ProfileAccountInfo = ({ email, role }: ProfileAccountInfoProps) => {
  const t = useTranslations('profile.account');

  return (
    <Card variant="secondary">
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Typography.Paragraph size="sm" color="muted">{t('email')}</Typography.Paragraph>
          <Typography.Paragraph size="sm">{email}</Typography.Paragraph>
        </div>
        <div className="flex items-center justify-between">
          <Typography.Paragraph size="sm" color="muted">{t('role')}</Typography.Paragraph>
          <Typography type="body-sm">{role}</Typography>
        </div>
      </Card.Content>
    </Card>
  );
};
