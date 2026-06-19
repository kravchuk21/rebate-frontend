const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string) {
  let formatter = formatterCache.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    formatterCache.set(locale, formatter);
  }
  return formatter;
}

export function formatDateYMD(date: Date | string | number, locale: string): string {
  const value = date instanceof Date ? date : new Date(date);
  const parts = Object.fromEntries(
    getFormatter(locale)
      .formatToParts(value)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}.${parts.month}.${parts.day}`;
}
