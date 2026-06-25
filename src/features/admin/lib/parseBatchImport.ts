import type { RebateAdminBatchImportItem } from "@/shared/api/generated/types.gen";

/**
 * A single line parsed from the pasted CSV/TSV. `error` is set (to a localized
 * message) when the row fails validation; valid rows have it `undefined`.
 */
export interface ParsedRow {
  /** 1-based index of the source line, used as a stable key and shown to the admin. */
  line: number;
  broker_id: string;
  uid: string;
  volume: string;
  gross_rebate: string;
  error?: string;
}

/** Expected column order of each pasted line. */
const COLUMNS = ["broker_id", "uid", "volume", "gross_rebate"] as const;

/** Tokens that hint the first line is a header row rather than data. */
const HEADER_TOKENS = ["broker", "uid", "volume", "rebate", "gross"];

/**
 * Split a line into columns. Tab wins (Excel/Sheets paste), then comma, then
 * semicolon, falling back to any run of whitespace.
 */
const splitColumns = (line: string): string[] => {
  if (line.includes("\t")) return line.split("\t");
  if (line.includes(",")) return line.split(",");
  if (line.includes(";")) return line.split(";");
  return line.trim().split(/\s+/);
};

const looksLikeHeader = (columns: string[]): boolean => {
  const joined = columns.join(" ").toLowerCase();
  return HEADER_TOKENS.some((token) => joined.includes(token));
};

/**
 * Parse pasted CSV/TSV text into rows. Blank lines are ignored and a leading
 * header row is skipped automatically. Each row is validated; `validate`
 * receives a short key (e.g. `"brokerId"`) and returns a localized message.
 */
export const parseBatchImport = (
  text: string,
  validate: (key: string) => string,
): ParsedRow[] => {
  const rows: ParsedRow[] = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    if (!rawLine.trim()) return;

    const columns = splitColumns(rawLine).map((column) => column.trim());

    // Skip a header line, but only when it is the very first data-bearing line.
    if (rows.length === 0 && looksLikeHeader(columns)) return;

    const [broker_id = "", uid = "", volume = "", gross_rebate = ""] = columns;

    let error: string | undefined;
    if (!broker_id) error = validate("brokerId");
    else if (!uid) error = validate("uid");
    else if (!gross_rebate) error = validate("grossRebate");
    else if (Number.isNaN(Number(gross_rebate))) error = validate("grossRebateNumber");
    else if (volume && Number.isNaN(Number(volume))) error = validate("volumeNumber");

    rows.push({ line: index + 1, broker_id, uid, volume, gross_rebate, error });
  });

  return rows;
};

/** Map valid rows to the API payload, dropping empty optional fields. */
export const rowsToItems = (rows: ParsedRow[]): RebateAdminBatchImportItem[] =>
  rows
    .filter((row) => !row.error)
    .map((row) => ({
      broker_id: row.broker_id,
      uid: row.uid,
      gross_rebate: row.gross_rebate,
      ...(row.volume ? { volume: row.volume } : {}),
    }));

export const BATCH_IMPORT_COLUMNS = COLUMNS;
