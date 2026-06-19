import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

export const GoogleAuthButton = () => {
  const t = useTranslations();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

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
