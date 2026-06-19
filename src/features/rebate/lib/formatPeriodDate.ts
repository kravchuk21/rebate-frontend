// Format API period_date string (e.g. "2024-01-15T00:00:00Z") to display date
export const formatPeriodDate = (dateStr: string | undefined, locale: string): string => {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
};
