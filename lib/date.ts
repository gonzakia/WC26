export function formatKickoff(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatCalendarDate(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
