import { autoGenZodSchema } from "@/services/autoGen";

import type { Item, Loan } from "@prisma";
import { t } from "i18next";

export const getTableFields = (): TableField<Item>[] => [
  {
    label: t("Name"),
    binding: "product.name",
  },
];

export const getFields = (): Field<Item>[] => [
  {
    label: t("Product type"),
    binding: "product_id",
    type: "select",
    options: "products",
  },
  {
    label: t("Status"),
    binding: "product_status_id",
    type: "select",
    options: "product_status",
    required: false,
  },
  {
    label: t("Barcode number"),
    binding: "barcode_number",
    type: "number",
    required: false,
  },
  {
    label: t("Comments"),
    binding: "description",
    type: "text",
    required: false,
  },
  // {
  //   label: t("Location"),
  //   binding: 'storage_location_id',
  // },
];

export const zodSchema = autoGenZodSchema(getFields());

function capFirst(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function fDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("da-DK");
}

export class LoanHistory {
  loan: Loan & { loaner?: { name: string; username: string } };
  date_returned?: Date | string;

  constructor({
    loan,
    date_returned,
  }: {
    loan: Loan & { loaner?: { name: string; username: string } };
    date_returned?: Date | string;
  }) {
    this.loan = loan;
    this.date_returned = date_returned;
  }

  get isActive() {
    return this?.date_returned == null ? "activeLoan" : "";
  }

  get date() {
    let text = fDate(this.loan.created_at);

    if (this.date_returned) text += " - " + fDate(this.date_returned);

    return text;
  }

  get time() {
    if (!this.date_returned) return "Aktivt lån";
    let created = new Date(this.loan.created_at).getTime();
    let returned = new Date(this.date_returned).getTime();

    let diff = returned - created;

    if (diff < 0) return "";

    let months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    let days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;

    let text = "";

    if (months == 1) text += `${months} måned & `;
    else if (months > 0) text += `${months} måneder & `;

    text += `${days} dage`;

    return text;
  }

  get user() {
    if (!this.loan) return "";

    let { name = "", username } = this.loan.loaner || {};

    let nameList = name.split(" ");

    let firstName = capFirst(nameList[0]);
    let lastName = capFirst(nameList[nameList.length - 1]);

    return `${firstName} ${lastName} (${username})`;
  }
}
