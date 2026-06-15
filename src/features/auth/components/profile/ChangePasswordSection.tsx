'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, FieldError, Form, Input, Label, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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
    <Card>
      <Card.Header>
        <Card.Title>{t('profile.password.title')}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Controller
            control={control}
            name="current"
            render={({ field }) => (
              <TextField
                type="password"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.current}
                fullWidth
              >
                <Label>{t('profile.password.current')}</Label>
                <Input />
                <FieldError>{errors.current?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <TextField
                type="password"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.newPassword}
                fullWidth
              >
                <Label>{t('profile.password.new')}</Label>
                <Input />
                <FieldError>{errors.newPassword?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="confirm"
            render={({ field }) => (
              <TextField
                type="password"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.confirm}
                fullWidth
              >
                <Label>{t('profile.password.confirm')}</Label>
                <Input />
                <FieldError>{errors.confirm?.message}</FieldError>
              </TextField>
            )}
          />

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
