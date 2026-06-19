import { Pagination, Table } from "@heroui/react";

interface TablePaginationProps {
  offset: number;
  limit: number;
  totalCount: number;
  onOffsetChange: (offset: number) => void;
}

export const TablePagination = ({
  offset,
  limit,
  totalCount,
  onOffsetChange,
}: TablePaginationProps) => {
  const pageCount = Math.ceil(totalCount / limit);
  const pageIndex = Math.floor(offset / limit);

  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const start = offset + 1;
  const end = Math.min(offset + limit, totalCount);

  return (
    <Table.Footer>
      <Pagination size="sm">
        <Pagination.Summary>
          {start} to {end} of {totalCount} results
        </Pagination.Summary>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={pageIndex === 0}
              onPress={() => onOffsetChange(Math.max(0, offset - limit))}
            >
              <Pagination.PreviousIcon />
              Prev
            </Pagination.Previous>
          </Pagination.Item>
          {pages.map((p) => (
            <Pagination.Item key={p}>
              <Pagination.Link
                isActive={p === pageIndex + 1}
                onPress={() => onOffsetChange((p - 1) * limit)}
              >
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Next
              isDisabled={pageIndex >= pageCount - 1}
              onPress={() => onOffsetChange(offset + limit)}
            >
              Next
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </Table.Footer>
  );
};
