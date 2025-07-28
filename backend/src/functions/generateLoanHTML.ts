import fs from "fs";
import Handlebars from "handlebars";

import prisma from "@/config/prisma";

export async function generateLoanHTML(loan_id: number, email = false) {
  const source = fs.readFileSync("src/templates/loan.hbs", "utf8");
  const template = Handlebars.compile(source);

  const loan = await prisma.loan.findFirst({
    where: { id: loan_id },
    include: {
      items_in_loan: { include: { item: { include: { product: true } } } },
      loaner: true,
      personnel: true,
    },
  });

  const itemsInLoan = await prisma.itemInLoan.findMany({
    where: { loan_id },
  });

  if (!loan) return "";

  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  const date_to_be_returned =
    new Date(loan.created_at).getTime() +
    (loan.loan_length || 0) * dayInMilliseconds;

  function formatDate(date: Date | string | number) {
    return new Date(date).toLocaleDateString("da-DK", { dateStyle: "full" });
  }

  const html = template({
    ...loan,
    date_to_be_returned,
    loaner: loan.loaner,
    helpdesk_personel: loan.personnel,
    created_at: formatDate(loan.created_at),
    return_date: formatDate(date_to_be_returned),
    itemsInLoan: itemsInLoan,
    email,
  });

  return html;
}
