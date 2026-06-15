'use client';

import { useState } from 'react';
import { Button, Card, Skeleton, Input } from '@heroui/react';
import { useTranslations } from 'next-intl';

import type { ReferralStatsResponse } from '@/shared/api/generated/types.gen';

import { useReferralStats } from '../hooks/useReferralStats';

export const ReferralLinkCard = () => {
  const t = useTranslations('referrals.link');
  const { data, isLoading } = useReferralStats();
  const [copied, setCopied] = useState(false);

  const stats = data?.data as ReferralStatsResponse | undefined;

  const handleCopy = () => {
    if (!stats?.referral_url) return;
    navigator.clipboard.writeText(stats.referral_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card variant="secondary">
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
        <Card.Description>{t('description')}</Card.Description>
      </Card.Header>
      <Card.Content>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="flex items-center gap-2 mt-auto">
            <Input className="flex-1" value={stats?.referral_url ?? '—'} disabled />
            <Button onPress={handleCopy} isDisabled={!stats?.referral_url}>
              {copied ? t('copied') : t('copy')}
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
