'use client';

import { useState } from 'react';
import { Button, Card, Chip, Typography, useOverlayState } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { TwoFADisableModal } from './TwoFADisableModal';
import { TwoFASetupModal } from './TwoFASetupModal';
import { WidgetCard } from '@/shared/components/WidgetCard';

interface TwoFASectionProps {
  initialEnabled?: boolean;
}

export const TwoFASection = ({ initialEnabled = false }: TwoFASectionProps) => {
  const t = useTranslations('profile.twoFA');
  const [enabled, setEnabled] = useState(initialEnabled);

  const setupModal = useOverlayState();
  const disableModal = useOverlayState();

  return (
    <WidgetCard>
      <Card.Header>
        <Card.Title className="flex gap-2 items-start">
          {t('title')}
          <Chip color={enabled ? 'success' : 'danger'}>
            <Chip.Label>{enabled ? t('enabled') : t('disabled')}</Chip.Label>
          </Chip>
        </Card.Title>
        <Card.Description>{t('description')}</Card.Description>
      </Card.Header>

      <Card.Content>
        <div className="mt-auto">
          {enabled ? (
            <Button variant="danger" onPress={disableModal.open}>
              {t('disableBtn')}
            </Button>
          ) : (
            <Button variant="primary" onPress={setupModal.open}>
              {t('enableBtn')}
            </Button>
          )}
        </div>
      </Card.Content>

      <TwoFASetupModal
        isOpen={setupModal.isOpen}
        onOpenChange={setupModal.setOpen}
        onEnabled={() => setEnabled(true)}
      />
      <TwoFADisableModal
        isOpen={disableModal.isOpen}
        onOpenChange={disableModal.setOpen}
        onDisabled={() => setEnabled(false)}
      />
    </WidgetCard>
  );
};
