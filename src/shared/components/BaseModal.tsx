"use client";

import { Modal } from "@heroui/react";
import type { ReactNode } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  dialogClassName?: string;
  children: ReactNode;
}

export const BaseModal = ({
  isOpen,
  onOpenChange,
  dialogClassName = "sm:max-w-[420px]",
  children,
}: BaseModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container scroll="outside">
          <Modal.Dialog className={dialogClassName}>
            <Modal.CloseTrigger />
            {children}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
