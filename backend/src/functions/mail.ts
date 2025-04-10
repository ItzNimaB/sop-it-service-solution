import dotenv from "dotenv";
import Mailjet from "node-mailjet";
import nodemailer from "nodemailer";
import { Resend } from "resend";

import prisma from "@/configs/prisma.config";
import { loans } from "@prisma/client";

import { isProd } from "./general";

dotenv.config();

const {
  MAIL_HOST: host,
  MAIL_PORT: port,
  MAIL_USERNAME: username,
  MAIL_PASSWORD: password,
  MAIL_ENCRYPTION: encryption,
  MAIL_FROM_ADDRESS: from_addr,
  MAIL_FROM_NAME: from_name,
  MAIL_RESEND_API_KEY: resend_api_key,
} = process.env;

// not used
export async function resendSendMail(
  to: string,
  subject: string,
  text: string
) {
  if (!resend_api_key) {
    console.error("Missing MAIL_RESEND_API_KEY");
    return { success: false };
  }

  const resend = new Resend(resend_api_key);

  if (!username || !password || !from_addr || !from_name) return;

  if (["test", "development"].includes(process.env.NODE_ENV || "")) {
    console.log(`Mail to: ${to}\nSubject: ${subject}\n`);
    return { success: true };
  }

  const from = `${from_name} <${from_addr}>`;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: text,
    react: null,
  });

  if (error) {
    console.error(error);
    return { success: false };
  }

  return data;
}

// not used
export async function mailjetSendMail(
  to: string,
  subject: string,
  text: string
) {
  if (!username || !password || !from_addr || !from_name) return;

  const mailjet = Mailjet.apiConnect(username, password);

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: { Email: from_addr, Name: from_name },
        To: [{ Email: to }],
        Subject: subject,
        TextPart: text,
      },
    ],
  });

  const { body } = await request;

  return body;
}

export async function nodemailerSendMail(
  to: string,
  subject: string,
  text: string
) {
  let user = username;
  let pass = password;

  if (!isProd()) {
    const testAccount = await nodemailer.createTestAccount();

    user = testAccount.user;
    pass = testAccount.pass;
  }

  if (!username || !password || !from_addr || !from_name) return;

  const transporter = nodemailer.createTransport(
    {
      host,
      port: Number(port),
      auth: { user, pass },
      secure: encryption === "ssl",
      tls: { rejectUnauthorized: false },
    },
    { from: `${from_name} <${from_addr}>` }
  );

  const mailOptions = { to, subject, text };

  const { response } = await transporter.sendMail(mailOptions);

  return response;
}

export const sendMail = nodemailerSendMail;

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

    await sendMail(user_mail, subject, text);
  }

  await prisma.loans.updateMany({
    where: { UUID: { in: expiredLoans.map(({ UUID }) => Number(UUID)) } },
    data: { mail_sent: true },
  });
}

sendMailToExpiredLoans();
