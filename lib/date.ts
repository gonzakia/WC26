export function formatKickoff(
  date: Date,
  locale = "en-US",
  timeZone?: string,
) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatCalendarDate(
  date: Date,
  locale = "en-US",
  timeZone?: string,
) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
