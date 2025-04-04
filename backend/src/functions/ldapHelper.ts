import dotenv from "dotenv";
import { Client, SearchEntry, SearchOptions, createClient } from "ldapjs";

import { users } from "@prisma/client";

dotenv.config();

const {
  LDAP_HOST,
  LDAP_PORT,
  LDAP_USERNAME,
  LDAP_PASSWORD,
  NODE_ENV,
  LDAP_ADMINS = "",
  LDAP_SUPERIORS = "",
} = process.env;

export const attributes = ["cn", "sAMAccountName", "mail", "memberOf"];

interface getModeratorLevelProps {
  memberOf?: string[];
  dn: string;
}

export function getModeratorLevel({ memberOf, dn }: getModeratorLevelProps) {
  if (memberOf?.includes(LDAP_SUPERIORS)) return 2;

  if (memberOf?.includes(LDAP_ADMINS)) return 1;
  if (dn.includes("Zone9")) return 1;

  return 0;
}

export function formatEntryResult(entry: SearchEntry): user {
  let ldapUser = {} as any;

  entry.pojo.attributes.map(({ type, values }) => {
    if (type === "memberOf") ldapUser[type] = values;
    else ldapUser[type] = values[0];

    ldapUser.dn = entry.pojo.objectName;
  });

  const user: user = {
    dn: ldapUser.dn,
    firstName: ldapUser.cn.split(" ")[0],
    lastName: ldapUser.cn.split(" ")[1],
    fullName: ldapUser.cn,
    username: ldapUser.sAMAccountName,
    mail: ldapUser.mail,
    memberOf: ldapUser.memberOf,
    moderatorLevel: getModeratorLevel(ldapUser),
  };

  return user;
}

export function createLdapClient(): Promise<Client> {
  let resolve: any, reject: any;

  const promise = new Promise<Client>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const client = createClient({ url: `ldap://${LDAP_HOST}:${LDAP_PORT}` });

  if (!LDAP_USERNAME || !LDAP_PASSWORD)
    return reject("LDAP credentials missing");

  client.bind(LDAP_USERNAME, LDAP_PASSWORD, (err) => {
    if (err) reject(err);
    else resolve(client);
  });

  return promise;
}

export async function getUsers(search: string, options: SearchOptions) {
  // let resolve: any, reject: any;

  // const promise = new Promise<users[] | any[]>((res, rej) => {
  //   resolve = res;
  //   reject = rej;
  // });

  // if (NODE_ENV === "development") return [];

  const client = await createLdapClient();

  return new Promise<users[] | any[]>((resolve, reject) => {
    client.search(search, options, (err, searchRes) => {
      if (err) reject("Search error");

      const users: user[] = [] as any[];

      searchRes.on("searchEntry", (entry) => {
        const user = formatEntryResult(entry);

        users.push(user);
      });

      searchRes.on("error", (err) => {
        reject(err);

        client.unbind((err) => {
          if (err) console.error("Error in unbinding: ", err);
        });
      });

      searchRes.on("end", () => {
        resolve(users);

        client.unbind((err) => {
          if (err) console.error("Error in unbinding: ", err);
        });
      });
    });
  });
}
