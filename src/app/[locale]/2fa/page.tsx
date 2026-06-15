'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Typography, Link } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { FormField } from '@/shared/components/FormField';
import { getErrorMessage } from '@/features/auth/lib/getErrorMessage';
import { useTwoFAVerify } from '@/features/auth/hooks/useTwoFAVerify';
import { createTwoFASchema, type TwoFAFormValues } from '@/features/auth/schemas/twoFASchema';

const TwoFAContent = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  const verify = useTwoFAVerify();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFAFormValues>({
    resolver: zodResolver(createTwoFASchema(t)),
    defaultValues: { code: '' },
  });

  const onSubmit = (data: TwoFAFormValues) => {
    if (!userId) return;

    verify.mutate({ user_id: userId, code: data.code });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-md">
        <Card.Content className="flex flex-col gap-4 py-8">
          <div className="flex flex-col items-center gap-1 text-center">
            <Typography type="h4">{t('twoFA.title')}</Typography>
            <Typography type="body-sm">{t('twoFA.subtitle')}</Typography>
          </div>

          {!userId ? (
            <Alert status="danger">
              <Alert.Content>
                <Alert.Description>
                  {t('twoFA.invalidSession')}{' '}
                  <Link href="/?modal=login" className="underline">
                    {t('twoFA.backToLogin')}
                  </Link>
                </Alert.Description>
              </Alert.Content>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <FormField
                control={control}
                name="code"
                label={t('twoFA.codeLabel')}
                placeholder={t('twoFA.codePlaceholder')}
                error={errors.code?.message}
                isRequired
              />

              {verify.isError && (
                <Alert status="danger">
                  <Alert.Content>
                    <Alert.Description>
                      {getErrorMessage(verify.error) ?? t('twoFA.errors.generic')}
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
              )}

              <Button type="submit" variant="primary" fullWidth isDisabled={verify.isPending}>
                {verify.isPending ? t('twoFA.submitting') : t('twoFA.submit')}
              </Button>

              <Typography.Paragraph size="sm" align="center">
                <Link href="/?modal=login">{t('twoFA.backToLogin')}</Link>
              </Typography.Paragraph>
            </form>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default function TwoFAPage() {
  return (
    <Suspense fallback={null}>
      <TwoFAContent />
    </Suspense>
  );
}
