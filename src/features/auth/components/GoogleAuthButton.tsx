import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { clientEnv } from "@/shared/lib/env.client";

export const GoogleAuthButton = () => {
  const t = useTranslations();
  const apiUrl = clientEnv.NEXT_PUBLIC_API_URL;

  return (
    <Button
      className="w-full"
      variant="tertiary"
      onPress={() => {
        window.location.href = `${apiUrl}/auth/google`;
      }}
    >
      <Icon icon="devicon:google" />
      {t("auth.login.continueWithGoogle")}
    </Button>
  );
};
