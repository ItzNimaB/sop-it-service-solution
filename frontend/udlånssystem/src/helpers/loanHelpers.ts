import type { items_in_loan } from "@prisma";

export function findActiveLoan(
  items_in_loan: items_in_loan[] | null,
): items_in_loan | undefined {
  if (!items_in_loan) return undefined;

  return items_in_loan.find((item) => !item.date_returned);
}
