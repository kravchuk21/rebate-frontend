'use client';

import { Tooltip, Typography } from '@heroui/react';
import { CircleQuestion } from '@gravity-ui/icons';

type InfoTooltipProps = {
  title: string;
  description: string;
};

export const InfoTooltip = ({ title, description }: InfoTooltipProps) => {
  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger aria-label="Info icon">
        <div className="rounded-full bg-accent-soft p-1">
          <CircleQuestion className="size-4 text-accent-soft-foreground" />
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content placement="bottom">
        <Typography.Paragraph size='xs'>{title}</Typography.Paragraph>
        <Typography.Paragraph size='xs' color='muted'>{description}</Typography.Paragraph>
      </Tooltip.Content>
    </Tooltip>
  );
};
