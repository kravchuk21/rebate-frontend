'use client';

import { useState } from 'react';
import { Button, Card, Chip, useOverlayState } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { TwoFADisableModal } from './TwoFADisableModal';
import { TwoFASetupModal } from './TwoFASetupModal';

interface TwoFASectionProps {
  initialEnabled?: boolean;
}

export const TwoFASection = ({ initialEnabled = false }: TwoFASectionProps) => {
  const t = useTranslations('profile.twoFA');
  const [enabled, setEnabled] = useState(initialEnabled);

  const setupModal = useOverlayState();
  const disableModal = useOverlayState();

  return (
    <Card>
      <Card.Header className="flex items-center justify-between">
        <Card.Title>{t('title')}</Card.Title>
        <Chip color={enabled ? 'success' : 'default'}>
          <Chip.Label>{enabled ? t('enabled') : t('disabled')}</Chip.Label>
        </Chip>
      </Card.Header>
      <Card.Content>
        {enabled ? (
          <Button variant="danger" onPress={disableModal.open}>
            {t('disableBtn')}
          </Button>
        ) : (
          <Button variant="primary" onPress={setupModal.open}>
            {t('enableBtn')}
          </Button>
        )}
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
    </Card>
  );
};
