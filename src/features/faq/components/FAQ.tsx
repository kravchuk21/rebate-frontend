import { ChevronDown } from "@gravity-ui/icons";
import { Accordion, Typography } from "@heroui/react";
import { getTranslations } from "next-intl/server";

interface FAQCategory {
  title: string;
  items: {
    title: string;
    content: string;
  }[];
}

interface FAQProps {
  locale: string;
}

export async function FAQ({ locale }: FAQProps) {
  const t = await getTranslations({ locale, namespace: "faq" });
  const categories = t.raw("categories") as FAQCategory[];

  return (
    <div className="flex flex-col gap-6">
      {categories.map((category) => (
        <div key={category.title} className="flex flex-col gap-2">
          <Typography.Paragraph color="muted">{category.title}</Typography.Paragraph>
          <Accordion className="w-full" variant="surface">
            {category.items.map((item, index) => (
              <Accordion.Item key={index}>
                <Accordion.Heading>
                  <Accordion.Trigger>
                    {item.title}
                    <Accordion.Indicator>
                      <ChevronDown />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>{item.content}</Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
