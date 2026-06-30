import { Typography, Chip, Link } from "@heroui/react";
import type { Broker } from "@/features/brokers/lib/brokers";
import { CopyButton } from "@/shared/components/CopyButton";

interface BrokerArticleProps {
  broker: Broker;
}

export const BrokerArticle = ({ broker }: BrokerArticleProps) => (
  <article className="flex flex-col gap-6">
    {(broker.rebate || broker.code || broker.website) && (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {broker.rebate && <Chip variant="soft" color="success">{broker.rebate}</Chip>}
        {broker.code && (
          <span className="inline-flex items-center gap-1">
            <Chip>{broker.code}</Chip>
            <CopyButton value={broker.code} size="sm" variant="ghost" />
          </span>
        )}
        {broker.website && (
          <span className="inline-flex items-center gap-1">
            <Link href={broker.website} target="_blank" rel="noopener noreferrer">
              {new URL(broker.website).hostname}
              <Link.Icon />
            </Link>
            <CopyButton value={broker.website} size="sm" variant="ghost" />
          </span>
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
