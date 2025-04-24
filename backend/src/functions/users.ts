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
  // if (["development", "test"].includes(process.env.NODE_ENV || "")) return;

  const { data } = await getLdapUsers();

  for (let loan of loans) {
    let user = data.find(({ username }: any) => username == loan[usernameKey]);

    loan.Navn = user?.fullName || "";
  }
}

export async function getLdapUsers(res?: any): Promise<any> {
  // if (["development", "test"].includes(process.env.NODE_ENV || "")) {
  //   return {
  //     headers,
  //     data: [
  //       {
  //         UUID: 1,
  //         username: "johndoe0000",
  //         date_created: new Date(),
  //         date_updated: new Date(),
  //       },
  //     ],
  //   };
  // }

  try {
    const searchOptions = {
      filter: "(objectClass=person)",
      scope: "sub",
      attributes,
    } as SearchOptions;

    if (!LDAP_USERS) {
      if (res) res.status(500).json({ error: "LDAP credentials missing" });
      return [];
    }

    const users = await getUsers(LDAP_USERS, searchOptions);

    if (res) res.json({ headers, data: users });
    return { headers, data: users };
  } catch (error) {
    console.error("Error in LDAP client creation or binding:", error);
    if (res) res.status(500).json({ error: "Internal server error" });
    return { error: "Internal server error" };
  }
}
