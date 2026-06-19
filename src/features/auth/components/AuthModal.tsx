"use client";

import { Modal } from "@heroui/react";
import { useAuthModal } from "../hooks/useAuthModal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { TwoFAModal } from "./TwoFAModal";

interface AuthModalProps {
  defaultReferralCode?: string;
}

export const AuthModal = ({ defaultReferralCode }: AuthModalProps) => {
  const { currentModal, close } = useAuthModal();

  const isOpen = currentModal !== null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
        <Modal.Container scroll="outside">
          <Modal.Dialog className="w-full sm:max-w-[380px]">
            <Modal.Body>
              {currentModal === "login" && <LoginForm />}
              {currentModal === "register" && (
                <RegisterForm defaultReferralCode={defaultReferralCode} />
              )}
              {currentModal === "twoFa" && <TwoFAModal />}
            </Modal.Body>
            <Modal.CloseTrigger />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
