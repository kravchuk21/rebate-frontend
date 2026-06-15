'use client';

import { useState } from 'react';
import { Button, Card, Input, Typography } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { useReferralStats } from '@/features/referral/hooks/useReferralStats';
import type { ReferralStatsResponse } from '@/shared/api/generated/types.gen';

interface ProfileAccountInfoProps {
  email: string;
  role: string;
}

export const ProfileAccountInfo = ({ email, role }: ProfileAccountInfoProps) => {
  const t = useTranslations('profile.account');
  const tReferrals = useTranslations('referrals.link');
  const { data } = useReferralStats();
  const [copied, setCopied] = useState(false);

  const stats = data?.data as ReferralStatsResponse | undefined;
  const referralCode = stats?.referral_code;

  const handleCopy = () => {
    if (!referralCode) return;

    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        {referralCode && (
          <div className="flex items-center justify-between">
            <Typography.Paragraph size="sm" color="muted">{t('referralCode')}</Typography.Paragraph>
            <div className="flex items-center gap-2">
              <Input value={referralCode} disabled />
              <Button size="sm" onPress={handleCopy}>
                {copied ? t('copied') : tReferrals('copy')}
              </Button>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
