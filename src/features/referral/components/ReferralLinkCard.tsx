'use client';

import { useState } from 'react';
import { Button, Card, Skeleton } from '@heroui/react';
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
    <Card>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
        <Card.Description>{t('description')}</Card.Description>
      </Card.Header>
      <Card.Content>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted">{t('codeLabel')}</span>
              <span className="font-medium">{stats?.referral_code ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-1 truncate rounded-md border border-default px-3 py-2 text-sm">
                {stats?.referral_url ?? '—'}
              </span>
              <Button
                variant="secondary"
                onPress={handleCopy}
                isDisabled={!stats?.referral_url}
              >
                {copied ? t('copied') : t('copy')}
              </Button>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
