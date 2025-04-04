export function findActiveLoan(
  items_in_loan: itemInLoanModel[] | null,
): itemInLoanModel | undefined {
  if (!items_in_loan) return undefined;

  return items_in_loan.find((item) => !item.date_returned);
}
