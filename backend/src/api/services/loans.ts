import prisma from "@/config/prisma";
import {
  getUsers,
  ldapAuthenticate,
  returnLoan as returnLoanHelper,
  sendMail,
} from "@/functions";
import { generateLoanHTML } from "@/functions/generateLoanHTML";
import { createLoanSchema } from "@/schemas/loans";
import { ItemInLoan, Prisma } from "@prisma/client";

export async function createOne(values: ILoanCreateInput): Promise<IResponse> {
  const { data, error } = createLoanSchema.safeParse(values);
  if (error) return { status: 400, data: error };

  let { loan, products, personel_username, personel_password } = data;

  const authenticate = await ldapAuthenticate(
    personel_username,
    personel_password
  );

  if (!authenticate) return { status: 401 };

  const helpdesk_personel = await prisma.user.findFirst({
    where: { username: personel_username },
  });

  if (!helpdesk_personel) return { status: 401 };

  loan.helpdesk_personel_id = helpdesk_personel.id;

  const newLoan = await prisma.loan.create({
    data: {
      ...loan,
      items_in_loan: {
        create: products.map(({ id, withBag, withLock }) => ({
          item_id: id,
          withBag: Boolean(withBag),
          withLock: Boolean(withLock),
        })),
      },
    },
  });

  const user = await prisma.user.findFirst({ where: { id: loan.user_id } });
  const [ldapUser] = await getUsers({ username: user?.username });

  if (!ldapUser) return { status: 404, data: { success: false } };

  const userEmail = ldapUser?.mail || user?.username + "@edu.sde.dk";

  const loanReceipt = await generateLoanHTML(newLoan.id, true);

  await sendMail({ to: userEmail, subject: "Lånekontrakt", html: loanReceipt });

  return { status: 201, data: newLoan };
}

interface Item {
  id: number;
  loan_id: number;
}

export async function returnLoan(items: Item[]): Promise<IResponse> {
  if (!items) return { status: 400, data: { success: false } };

  var itemsInLoan: Prisma.Prisma__ItemInLoanClient<ItemInLoan>[] = [];

  for (const item of items) {
    const findItemInLoan = await prisma.itemInLoan.findFirst({
      where: { item_id: item.id, loan_id: item.loan_id },
    });

    if (!findItemInLoan) return { status: 404, data: { success: false } };

    const itemInLoanid = findItemInLoan.id;

    const itemInLoan = prisma.itemInLoan.update({
      where: { id: itemInLoanid },
      data: { returned_at: new Date() },
    });

    itemsInLoan.push(itemInLoan);
  }

  await prisma.$transaction(itemsInLoan);

  await returnLoanHelper(items[0].loan_id);

  return { status: 200, data: { success: true } };
}

export async function getPdf(id: string): Promise<IResponse> {
  const html = await generateLoanHTML(Number(id));

  return { status: 200, data: html };
}
