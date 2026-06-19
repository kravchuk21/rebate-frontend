"use client";

import "@/shared/api/instance";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Card, Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";
import { postAuthVerifyEmail } from "@/shared/api/generated/requests/auth/postAuthVerifyEmail.gen";
import { getErrorMessage } from "@/features/auth/lib/getErrorMessage";

type Status = "loading" | "success" | "error";

const VerifyEmailContent = () => {
  const t = useTranslations("auth.verifyEmail");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(() => (token ? "loading" : "error"));
  const [error, setError] = useState<string | undefined>(undefined);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    if (!token) return;

    postAuthVerifyEmail({ body: { token } })
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setError(getErrorMessage(err));
      });
  }, [token]);

  return (
    <Card>
      <Card.Content className="flex flex-col items-center gap-4 py-8 text-center">
        {status === "loading" && (
          <>
            <Spinner />
            <p>{t("loading")}</p>
          </>
        )}

        {status === "success" && (
          <Alert status="success">
            <Alert.Content>
              <Alert.Description>
                {t("success")}{" "}
                <Link href={`${Routes.Home}?modal=login`} className="underline">
                  {t("successAction")}
                </Link>
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        {status === "error" && (
          <Alert status="danger">
            <Alert.Content>
              <Alert.Description>
                {error ?? t("error")}{" "}
                <Link href={`${Routes.Home}?modal=login`} className="underline">
                  {t("errorAction")}
                </Link>
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}
      </Card.Content>
    </Card>
  );
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
