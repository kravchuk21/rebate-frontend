'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, Form, toast, Typography, Link } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormField } from '@/shared/components/FormField';
import { getErrorMessage } from '../lib/getErrorMessage';
import { useAuthModal } from '../hooks/useAuthModal';
import { useLogin } from '../hooks/useLogin';
import { createLoginSchema, type LoginFormValues } from '../schemas/loginSchema';
import { AuthDivider } from './AuthDivider';
import { GoogleAuthButton } from './GoogleAuthButton';

export const LoginForm = () => {
  const t = useTranslations();
  const { switchTo } = useAuthModal();
  const login = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data, {
      onError: (error) => {
        toast.danger(getErrorMessage(error) ?? t('auth.errors.generic'));
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar>
          <Avatar.Image
            alt="Avatar"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
          />
          <Avatar.Fallback>AV</Avatar.Fallback>
        </Avatar>
        <Typography type="h4">
          {t('auth.login.title')}
        </Typography>
        <Typography type="body-sm">
          {t('auth.login.subtitle')}
        </Typography>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          control={control}
          name="email"
          label={t('auth.login.email')}
          placeholder="you@example.com"
          type="email"
          error={errors.email?.message}
          isRequired
        />
        <FormField
          control={control}
          name="password"
          label={t('auth.login.password')}
          placeholder="••••••••"
          type="password"
          error={errors.password?.message}
          isRequired
        />
        <Button type="submit" variant="primary" fullWidth isDisabled={login.isPending}>
          {login.isPending ? t('auth.login.loading') : t('auth.login.submit')}
        </Button>
      </Form>

      <AuthDivider translationKey="auth.login.or" />

      <GoogleAuthButton />

      <Typography.Paragraph size="sm" align="center">
        {t('auth.login.noAccount')}{' '}
        <Link onPress={() => switchTo('register')}>
          {t('auth.login.register')}
        </Link>
      </Typography.Paragraph>
    </div>
  );
};
