import { Typography, Chip, Link } from "@heroui/react";
import type { Broker } from "@/features/brokers/lib/brokers";

interface BrokerArticleProps {
  broker: Broker;
}

export const BrokerArticle = ({ broker }: BrokerArticleProps) => (
  <article className="flex flex-col gap-6">
    {(broker.rebate || broker.website) && (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {broker.rebate && <Chip>{broker.rebate}</Chip>}
        {broker.website && (
          <Link href={broker.website} target="_blank" rel="noopener noreferrer">
            {broker.website.replace(/^https?:\/\//, "")}
            <Link.Icon />
          </Link>
        )}
      </div>
    )}
    <Typography.Prose
      className="flex flex-col gap-3"
      dangerouslySetInnerHTML={{ __html: broker.contentHtml }}
    >
      {null}
    </Typography.Prose>
  </article>
);
