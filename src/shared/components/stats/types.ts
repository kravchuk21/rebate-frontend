// Shared shape for period-based earnings stats (rebate, referral earnings, ...).
// Both RebateStatsResponse and ReferralEarningsStatsResponse are structurally
// compatible with this interface.
export interface PeriodDailyStat {
  amount?: number;
  date?: string;
}

export interface PeriodStatsResponse {
  all_time?: number;
  current_month?: number;
  last_7_days?: number;
  last_month?: number;
  today?: number;
  last_7_days_breakdown?: PeriodDailyStat[];
  last_30_days_breakdown?: PeriodDailyStat[];
}

export type RangeMode = "last_7_days" | "last_30_days";

export const RANGE_MODES: RangeMode[] = ["last_7_days", "last_30_days"];

// Loose translator type so the generic widget works with any namespace.
export type StatsTranslator = (key: string, values?: Record<string, string | number>) => string;
