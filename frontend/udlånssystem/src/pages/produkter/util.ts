import { autoGenZodSchema } from "@/services/autoGen";

export const fields: Field<itemModel>[] = [
  {
    label: "Produkttype",
    binding: "product_id",
    type: "select",
    options: "products",
  },
  {
    label: "Status",
    binding: "product_status_id",
    type: "select",
    options: "product_status",
    required: false,
  },
  {
    label: "Stregkode Nummer",
    binding: "barcode_number",
    type: "number",
    required: false,
  },
  {
    label: "Kommentar",
    binding: "description",
    type: "text",
    required: false,
  },
  // {
  //   label: 'Lokation',
  //   binding: 'storage_location_id',
  // },
];

export const zodSchema = autoGenZodSchema(fields);

function capFirst(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function fDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("da-DK");
}

export class LoanHistory {
  loan: loanModel | any;
  date_returned?: Date | string;

  constructor({
    loans,
    date_returned,
  }: {
    loans: loanModel | any;
    date_returned?: Date | string;
  }) {
    this.loan = loans;
    this.date_returned = date_returned;
  }

  isActive() {
    if (this?.date_returned == null) return "activeLoan";
    return "";
  }

  date() {
    let text = fDate(this.loan.date_created);

    if (this.date_returned) {
      text += " - " + fDate(this.date_returned);
    }

    return text;
  }

  time() {
    if (!this.date_returned) return "Aktivt lån";
    let created = new Date(this.loan.date_created).getTime();
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

  user() {
    if (this.loan) {
      let { name = "", username } = this.loan.users_loans_user_idTousers;

      let nameList = name.split(" ");

      let firstName = capFirst(nameList[0]);
      let lastName = capFirst(nameList[nameList.length - 1]);

      return `${firstName} ${lastName} (${username})`;
    }

    return "";
  }
}
