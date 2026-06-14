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
import { useRegister } from '../hooks/useRegister';
import { createRegisterSchema, type RegisterFormValues } from '../schemas/registerSchema';

interface RegisterFormProps {
  defaultReferralCode?: string;
}

export const RegisterForm = ({ defaultReferralCode }: RegisterFormProps) => {
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: { email: '', password: '', referral_code: defaultReferralCode ?? '' },
  });

  const register = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    register.mutate(data);
  };

  if (register.isSuccess) {
    return (
      <Card>
        <Card.Content>
          <Alert status="success">
            <Alert.Content>
              <Alert.Description>{t('auth.register.successMessage')}</Alert.Description>
            </Alert.Content>
          </Alert>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('auth.register.title')}</Card.Title>
        <Card.Description>{t('auth.register.subtitle')}</Card.Description>
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
                <Label>{t('auth.register.email')}</Label>
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
                <Label>{t('auth.register.password')}</Label>
                <Input placeholder="••••••••" />
                <FieldError>{errors.password?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="referral_code"
            render={({ field }) => (
              <TextField
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.referral_code}
                fullWidth
              >
                <Label>{t('auth.register.referralCode')}</Label>
                <Input placeholder="ABCD1234" />
                <FieldError>{errors.referral_code?.message}</FieldError>
              </TextField>
            )}
          />

          {register.isError && (
            <Alert status="danger">
              <Alert.Content>
                <Alert.Description>
                  {getErrorMessage(register.error) ?? t('auth.errors.generic')}
                </Alert.Description>
              </Alert.Content>
            </Alert>
          )}

          <Button type="submit" variant="primary" fullWidth isDisabled={register.isPending}>
            {register.isPending ? t('auth.register.loading') : t('auth.register.submit')}
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
};
