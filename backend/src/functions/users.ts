import { SearchOptions } from "ldapjs";

import { attributes, getUsers } from ".";

const { LDAP_USERS } = process.env;

const headers = [
  "firstName",
  "lastName",
  "fullName",
  "username",
  "mail",
  "date_created",
  "date_updated",
];

export async function addFullname(
  loans: { Navn: string; [usernameKey: string]: string | any }[],
  usernameKey: string
) {
  const { data } = await getLdapUsers();

  for (let loan of loans) {
    let user = data.find(({ username }: any) => username == loan[usernameKey]);

    loan.Navn = user?.fullName || "";
  }
}

export async function getLdapUsers(): Promise<any> {
  try {
    const users = await getUsers();

    return { headers, data: users };
  } catch (error) {
    console.error("Error in LDAP client creation or binding:", error);
    return { error: "Internal server error" };
  }
}
