"use client";

import { Alert, Button } from "@heroui/react";
import { useLocalStorage } from "@siberiacancode/reactuse";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

const CONSENT_KEY = "cookie-consent";

export const CookieConsent = () => {
  const t = useTranslations("common.cookies");

  const { value: accepted, set: setAccepted } = useLocalStorage(CONSENT_KEY, false);

  return (
    <AnimatePresence>
      {!accepted && (
        <motion.div
          className="fixed right-4 bottom-4 z-50 max-w-2xl max-sm:left-4"
          style={{ viewTransitionName: "cookie-consent" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Alert className="bg-default items-center shadow-2xl">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{t("title")}</Alert.Title>
              <Alert.Description>{t("description")}</Alert.Description>
            </Alert.Content>
            <Button size="sm" onPress={() => setAccepted(true)}>
              {t("accept")}
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
