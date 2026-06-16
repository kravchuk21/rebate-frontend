'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Form } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormField } from '@/shared/components/FormField';

const createPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      current: z.string().min(1, t('profile.password.validation.current')),
      newPassword: z.string().min(8, t('profile.password.validation.new')),
      confirm: z.string(),
    })
    .refine((data) => data.newPassword === data.confirm, {
      message: t('profile.password.validation.confirm'),
      path: ['confirm'],
    });

type PasswordFormValues = z.infer<ReturnType<typeof createPasswordSchema>>;

export const ChangePasswordSection = () => {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(createPasswordSchema(t)),
    defaultValues: { current: '', newPassword: '', confirm: '' },
  });

  const onSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Card variant="secondary">
      <Card.Header>
        <Card.Title>{t('profile.password.title')}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            control={control}
            name="current"
            type="password"
            variant="primary"
            label={t('profile.password.current')}
            error={errors.current?.message}
          />

          <div className="flex gap-3">
            <FormField
              control={control}
              name="newPassword"
              type="password"
              variant="primary"
              label={t('profile.password.new')}
              error={errors.newPassword?.message}
            />

            <FormField
              control={control}
              name="confirm"
              type="password"
              variant="primary"
              label={t('profile.password.confirm')}
              error={errors.confirm?.message}
            />
          </div>

          {submitted && (
            <Alert status="default">
              <Alert.Content>
                <Alert.Description>{t('profile.password.notAvailable')}</Alert.Description>
              </Alert.Content>
            </Alert>
          )}

          <Button type="submit" variant="primary">
            {t('profile.password.submit')}
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
};
