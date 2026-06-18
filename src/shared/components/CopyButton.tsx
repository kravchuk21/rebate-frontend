'use client';

import { Copy } from '@gravity-ui/icons';
import { Button, toast, type ButtonProps } from '@heroui/react';
import { useTranslations } from 'next-intl';

interface CopyButtonProps {
  value: string;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
}

export const CopyButton = ({ value, size = 'sm', variant = 'ghost' }: CopyButtonProps) => {
  const t = useTranslations('common.copy');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t('success'));
    } catch {
      toast.danger(t('error'));
    }
  };

  return (
    <Button isIconOnly size={size} variant={variant} onClick={() => handleCopy()}>
      <Copy />
    </Button>
  );
};
