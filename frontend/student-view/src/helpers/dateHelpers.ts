export function dateToReadable(date: string | Date): string {
  if (!date) return "";

  return new Date(date).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "short",
  });
}
