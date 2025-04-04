import { SearchOptions } from "ldapjs";

import { attributes, getUsers } from ".";

const { LDAP_USERS, LDAP_ADMINS } = process.env;

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

    if (!LDAP_USERS || !LDAP_ADMINS) {
      if (res) res.status(500).json({ error: "LDAP credentials missing" });
      return [];
    }

    const users = await getUsers(LDAP_USERS, searchOptions);
    const admins = await getUsers(LDAP_ADMINS, searchOptions);

    if (res) res.json({ headers, data: [...users, ...admins] });
    return { headers, data: [...users, ...admins] };
  } catch (error) {
    console.error("Error in LDAP client creation or binding:", error);
    if (res) res.status(500).json({ error: "Internal server error" });
    return { error: "Internal server error" };
  }
}
