import prisma from "@/config/prisma";
import type { Loan } from "@prisma/client";

export async function returnLoan(loanId: Loan["id"]) {
  const itemsNotReturned = await prisma.itemInLoan.findMany({
    where: { loan_id: loanId, returned_at: null },
  });

  if (itemsNotReturned.length === 0) {
    await prisma.loan.update({
      where: { id: loanId },
      data: { date_of_return: new Date() },
    });

    return true;
  }

  return false;
}
