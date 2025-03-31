import type { users } from "@prisma/client";

declare global {
  interface ldapUser {
    dn: string;
    firstName: string;
    lastName: string;
    fullName: string;
    mail: string;
    memberOf?: string[];
  }

  interface user
    extends Omit<users, "UUID" | "date_created" | "date_updated">,
      ldapUser {
    UUID?: number;
    moderatorLevel: number;
  }
}

export {};
