import { ChevronDown } from "@gravity-ui/icons";
import { Accordion } from "@heroui/react";
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {categories.map((category) => (
        <div key={category.title}>
          <p className="text-md text-muted mb-2 font-medium">{category.title}</p>
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
