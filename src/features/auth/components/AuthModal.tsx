"use client";

import { Modal } from "@heroui/react";
import { BaseModal } from "@/shared/components/BaseModal";
import { useAuthModal } from "../hooks/useAuthModal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { TwoFAModal } from "./TwoFAModal";

interface AuthModalProps {
  defaultReferralCode?: string;
}

export const AuthModal = ({ defaultReferralCode }: AuthModalProps) => {
  const { currentModal, isOpen, close } = useAuthModal();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onOpenChange={handleOpenChange} dialogClassName="w-full sm:max-w-[380px]">
      <Modal.Body>
        {currentModal === "login" && <LoginForm />}
        {currentModal === "register" && <RegisterForm defaultReferralCode={defaultReferralCode} />}
        {currentModal === "twoFa" && <TwoFAModal />}
      </Modal.Body>
    </BaseModal>
  );
};
