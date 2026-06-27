"use client";

import { Copy } from "@gravity-ui/icons";
import { Button, toast, type ButtonProps } from "@heroui/react";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  value: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  isDisabled?: boolean;
  label?: string;
}

export const CopyButton = ({ value, size = "sm", variant = "ghost", isDisabled, label }: CopyButtonProps) => {
  const t = useTranslations("common.copy");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("success"));
    } catch {
      toast.danger(t("error"));
    }
  };

  return (
    <Button isIconOnly={!label} size={size} variant={variant} isDisabled={isDisabled} onClick={() => handleCopy()}>
      {label ?? <Copy />}
    </Button>
  );
};
