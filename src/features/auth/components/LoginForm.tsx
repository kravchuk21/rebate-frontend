'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { getErrorMessage } from '../lib/getErrorMessage';
import { useLogin } from '../hooks/useLogin';
import { createLoginSchema, type LoginFormValues } from '../schemas/loginSchema';

export const LoginForm = () => {
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { email: '', password: '' },
  });

  const login = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('auth.login.title')}</Card.Title>
        <Card.Description>{t('auth.login.subtitle')}</Card.Description>
      </Card.Header>
      <Card.Content>
        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                type="email"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.email}
                isRequired
                fullWidth
              >
                <Label>{t('auth.login.email')}</Label>
                <Input placeholder="you@example.com" />
                <FieldError>{errors.email?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                type="password"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.password}
                isRequired
                fullWidth
              >
                <Label>{t('auth.login.password')}</Label>
                <Input placeholder="••••••••" />
                <FieldError>{errors.password?.message}</FieldError>
              </TextField>
            )}
          />

          {login.isError && (
            <Alert status="danger">
              <Alert.Content>
                <Alert.Description>
                  {getErrorMessage(login.error) ?? t('auth.errors.generic')}
                </Alert.Description>
              </Alert.Content>
            </Alert>
          )}

          <Button type="submit" variant="primary" fullWidth isDisabled={login.isPending}>
            {login.isPending ? t('auth.login.loading') : t('auth.login.submit')}
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
};
