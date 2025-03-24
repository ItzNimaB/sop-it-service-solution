import prisma from "@/configs/prisma.config";
import {
  convertToPrismaTypes,
  ldapAuthenticate,
  returnLoan as returnLoanHelper,
  sendMail,
} from "@/functions";
import { generateLoanHTML } from "@/functions/generateLoanHTML";
import { createLoanSchema } from "@/schemas/loans";
import { Prisma, items_in_loan } from "@prisma/client";

export async function createOne(values: ILoanCreateInput): Promise<IResponse> {
  const { data, error } = createLoanSchema.safeParse(values);

  if (error) return { status: 400, data: error };

  let { loan, products, personel_username, personel_password } = data;

  const authenticate = await ldapAuthenticate(
    personel_username,
    personel_password
  ).catch((e) => console.log(e));

  if (!authenticate) return { status: 401 };

  const helpdesk_personel = await prisma.users.findFirst({
    where: { username: personel_username },
  });

  if (!helpdesk_personel) return { status: 401 };

  loan.helpdesk_personel_id = helpdesk_personel.UUID;

  loan = convertToPrismaTypes(loan, "loans");
  products = products.map((product) => convertToPrismaTypes(product, "items"));

  const newLoan = await prisma.loans.create({
    data: {
      ...loan,
      items_in_loan: {
        create: products.map(({ UUID, withBag, withLock }) => ({
          item_id: UUID,
          withBag: Boolean(withBag),
          withLock: Boolean(withLock),
        })),
      },
    },
  });

  const user = await prisma.users.findFirst({ where: { UUID: loan.user_id } });
  const userEmail = user?.username + "@edu.sde.dk";

  const loanReceipt = await generateLoanHTML(newLoan.UUID, true);

  sendMail(userEmail, "Lånekontrakt", loanReceipt);

  return { status: 201, data: newLoan };
}

interface Item {
  UUID: number;
  loan_id: number;
}

export async function returnLoan(items: Item[]): Promise<IResponse> {
  if (!items) return { status: 400, data: { success: false } };

  var itemsInLoan: Prisma.Prisma__items_in_loanClient<items_in_loan>[] = [];

  for (const item of items) {
    const findItemInLoan = await prisma.items_in_loan.findFirst({
      where: { item_id: item.UUID, loan_id: item.loan_id },
    });

    if (!findItemInLoan) return { status: 404, data: { success: false } };

    const itemInLoanUUID = findItemInLoan.UUID;

    const itemInLoan = prisma.items_in_loan.update({
      where: { UUID: itemInLoanUUID },
      data: { date_returned: new Date() },
    });

    itemsInLoan.push(itemInLoan);
  }

  await prisma.$transaction(itemsInLoan);

  await returnLoanHelper(items[0].loan_id);

  return { status: 200, data: { success: true } };
}

export async function getPdf(UUID: string): Promise<IResponse> {
  const html = await generateLoanHTML(Number(UUID));

  return { status: 200, data: html };
}
