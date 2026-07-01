"use client";

import { ChevronDown } from "@gravity-ui/icons";
import { Accordion, Typography, Link } from "@heroui/react";
import { useTranslations } from "next-intl";
import { DashboardLayout, DashboardItem } from "@/shared/components/layout";

// import { Link } from "@/i18n/navigation";
import { Routes } from "@/shared/lib/routes";

interface FaqItem {
  question: string;
  answer: string;
}

export const LandingFaqPreview = () => {
  const t = useTranslations("landing");
  const items = t.raw("faqPreview.items") as FaqItem[];

  return (
    <DashboardLayout>
      <DashboardItem>
        <Typography.Heading level={2} className="text-center text-3xl font-extrabold md:text-4xl">
          {t("faqPreview.title")}
        </Typography.Heading>
      </DashboardItem>
      <DashboardItem>
        <Typography.Paragraph color="muted" className="text-center">{t("faqPreview.subtitle")}</Typography.Paragraph>
      </DashboardItem>

      <DashboardItem>
        <Accordion variant="surface">
          {items.map((item, index) => (
            <Accordion.Item key={index}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  {item.question}
                  <Accordion.Indicator>
                    <ChevronDown />
                  </Accordion.Indicator>
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>{item.answer}</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </DashboardItem>


      <DashboardItem className="text-center">
        <Link href={Routes.Faq}>
          {t("faqPreview.viewAll")}
          <Link.Icon/>
        </Link>
      </DashboardItem>
    </DashboardLayout >
  );
};
