'use client';

import { useState } from 'react';
import { Button, Card, Typography } from '@heroui/react';
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
    <Card>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Typography type="body-sm" color="muted">
            {t('email')}
          </Typography>
          <Typography type="body-sm">{email}</Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography type="body-sm" color="muted">
            {t('role')}
          </Typography>
          <Typography type="body-sm">{role}</Typography>
        </div>
        {referralCode && (
          <div className="flex items-center justify-between">
            <Typography type="body-sm" color="muted">
              {t('referralCode')}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography type="body-sm">{referralCode}</Typography>
              <Button variant="tertiary" size="sm" onPress={handleCopy}>
                {copied ? t('copied') : tReferrals('copy')}
              </Button>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
