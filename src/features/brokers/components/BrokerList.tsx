import { Link } from "@/i18n/navigation";
import { Card, Chip } from "@heroui/react";
import type { BrokerMeta } from "@/features/brokers/lib/brokers";

interface BrokerListProps {
  brokers: BrokerMeta[];
}

export const BrokerList = ({ brokers }: BrokerListProps) => (
  <div className="flex flex-col gap-6">
    {brokers.map((broker) => (
      <Link key={broker.slug} href={`/brokers/${broker.slug}`}>
        <Card>
          <Card.Header>
            <Card.Title>{broker.name}</Card.Title>
            <Card.Description>{broker.description}</Card.Description>
          </Card.Header>
          {broker.rebate && (
            <Card.Footer className="flex gap-2">
              <Chip>{broker.rebate}</Chip>
            </Card.Footer>
          )}
        </Card>
      </Link>
    ))}
  </div>
);
