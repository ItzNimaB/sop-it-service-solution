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
    extends Omit<users, "id" | "created_at" | "updated_at">,
      ldapUser {
    id?: number;
    moderatorLevel: number;
  }

  interface String {
    toFirstLetterLowercase<T extends string>(this: T): FirstLetterLowercase<T>;
  }

  type FirstLetterLowercase<T extends string> = T extends `${infer F}${infer R}`
    ? `${Lowercase<F>}${R}`
    : never;
}

export {};
