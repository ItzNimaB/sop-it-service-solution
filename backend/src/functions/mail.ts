import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

import env from "@/config/env";
import { isProd } from "@/config/env";
import prisma from "@/config/prisma";
import type { Loan } from "@prisma/client";

dotenv.config();

let {
  MAIL_HOST: mailhost,
  MAIL_USERNAME: username,
  MAIL_PASSWORD: password,
  MAIL_FROM_ADDRESS: address,
  MAIL_FROM_NAME: name,
} = env;

export async function sendMail(mailOptions: MailOptions) {
  let user = username;
  let pass = password;
  let host = mailhost;

  if (!isProd) {
    const testAccount = await nodemailer.createTestAccount();

    user = testAccount.user;
    pass = testAccount.pass;
    host = testAccount.smtp.host;
    address = "test@localhost";
    name = "Test Account";
  }

  if (!address || !name) return;

  const transporter = nodemailer.createTransport(
    {
      host,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    },
    { from: { address, name } }
  );

  const mail = await transporter.sendMail(mailOptions);

  const getMessageSent = nodemailer.getTestMessageUrl(mail);

  if (!isProd) console.log(getMessageSent);

  return mail.response;
}

interface LoansWithUserMail extends Loan {
  user_mail: string;
  loan_length: number;
}

export async function sendMailToExpiredLoans() {
  const expiredLoans: LoansWithUserMail[] = await prisma.$queryRaw`
  SELECT loans.*,
  CONCAT(users.username, "@edu.sde.dk") AS user_mail
  FROM loans
  JOIN users ON loans.user_id = users.id
  WHERE date_of_return IS NULL
    AND loan_length IS NOT NULL
    AND mail_sent = 0
    AND DATE_ADD(loans.created_at, INTERVAL loan_length DAY) < NOW()
`;

  for (const loan of expiredLoans) {
    const { id, user_mail, created_at, loan_length } = loan;

    const date_to_return = new Date(
      new Date(created_at).setDate(created_at.getDate() + loan_length)
    );

    const { items_in_loan } = await prisma.loan.findUniqueOrThrow({
      where: { id: Number(id) },
      include: {
        items_in_loan: { include: { item: { include: { product: true } } } },
      },
    });

    const subject = "Lån udløbet";
    const text = `\
Hej ${user_mail},

Dit lån fra \
${created_at.toLocaleDateString()} til ${date_to_return.toLocaleDateString()} \
er udløbet efter ${loan_length} dag(e).

Du mangler at aflevere følgende produkt(er):
${items_in_loan
  .map(({ item }) => `#${item.id} ${item.product.name}`)
  .join("\n")}

Aflever det venligst hurtigst muligt.\n\nMvh.\nSDE's udlånssystem`;

    await sendMail({ to: user_mail, subject, text });
  }

  await prisma.loan.updateMany({
    where: { id: { in: expiredLoans.map(({ id }) => Number(id)) } },
    data: { mail_sent: true },
  });
}

// sendMailToExpiredLoans();
