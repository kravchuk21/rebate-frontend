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
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container>
          <Modal.Dialog className={dialogClassName}>
            {/* Default hit area is ~25px — too small for touch, first tap often misses on mobile. */}
            <Modal.CloseTrigger className="after:absolute after:-inset-2.5 after:content-['']" />
            {children}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
