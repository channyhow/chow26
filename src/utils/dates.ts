export function formatDate(value: string, locale?: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}

export function formatTime(value: string, locale?: string) {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function isSameDay(a: string, b: string) {
  const left = new Date(a);
  const right = new Date(b);
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

export function sortByStart<T extends { start: string }>(items: T[]) {
  return [...items].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}
