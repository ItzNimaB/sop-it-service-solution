import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

import prisma from "@/configs/prisma.config";
import { loans } from "@prisma/client";

import { isProd } from "./general";

dotenv.config();

let {
  MAIL_HOST: mailhost,
  MAIL_USERNAME: username,
  MAIL_PASSWORD: password,
  MAIL_FROM_ADDRESS: address,
  MAIL_FROM_NAME: name,
} = process.env;

export async function sendMail(mailOptions: MailOptions) {
  let user = username;
  let pass = password;
  let host = mailhost;

  if (!isProd()) {
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

  console.log("process.env:", process.env, "\n");

  console.log("mailOptions:", mailOptions, "\n");

  console.log("mail:", mail, "\n");

  console.log(getMessageSent);

  return mail.response;
}

interface LoansWithUserMail extends loans {
  user_mail: string;
  loan_length: number;
}

export async function sendMailToExpiredLoans() {
  const expiredLoans: LoansWithUserMail[] = await prisma.$queryRaw`
  SELECT loans.*,
  CONCAT(users.username, "@edu.sde.dk") AS user_mail
  FROM loans
  JOIN users ON loans.user_id = users.UUID
  WHERE date_of_return IS NULL
    AND loan_length IS NOT NULL
    AND mail_sent = 0
    AND DATE_ADD(loans.date_created, INTERVAL loan_length DAY) < NOW()
`;

  for (const loan of expiredLoans) {
    const { UUID, user_mail, date_created, loan_length } = loan;

    const date_to_return = new Date(
      new Date(date_created).setDate(date_created.getDate() + loan_length)
    );

    const { items_in_loan } = await prisma.loans.findUniqueOrThrow({
      where: { UUID: Number(UUID) },
      include: {
        items_in_loan: { include: { items: { include: { products: true } } } },
      },
    });

    const subject = "Lån udløbet";
    const text = `\
Hej ${user_mail},

Dit lån fra \
${date_created.toLocaleDateString()} til ${date_to_return.toLocaleDateString()} \
er udløbet efter ${loan_length} dag(e).

Du mangler at aflevere følgende produkt(er):
${items_in_loan
  .map(({ items }) => `#${items.UUID} ${items.products.name}`)
  .join("\n")}

Aflever det venligst hurtigst muligt.\n\nMvh.\nSDE's udlånssystem`;

    await sendMail({ to: user_mail, subject, text });
  }

  await prisma.loans.updateMany({
    where: { UUID: { in: expiredLoans.map(({ UUID }) => Number(UUID)) } },
    data: { mail_sent: true },
  });
}

// sendMailToExpiredLoans();
