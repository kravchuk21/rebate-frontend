import { ChevronDown } from '@gravity-ui/icons';
import { Accordion } from '@heroui/react';
import { getTranslations } from 'next-intl/server';

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
  const t = await getTranslations({ locale, namespace: 'faq' });
  const categories = t.raw('categories') as FAQCategory[];

  return (
    <div className="flex w-full flex-col gap-6 max-w-2xl mx-auto">
      {categories.map((category) => (
        <div key={category.title}>
          <p className="text-md mb-2 font-medium text-muted">{category.title}</p>
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
