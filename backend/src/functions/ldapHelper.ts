import dotenv from "dotenv";
import { Client, SearchEntry, SearchOptions, createClient } from "ldapjs";
import { promisify } from "util";

dotenv.config();

const {
  LDAP_HOST,
  LDAP_PORT,
  LDAP_USERNAME,
  LDAP_PASSWORD,
  NODE_ENV,
  LDAP_USERS = "",
  LDAP_ADMINS = "",
  LDAP_SUPERIORS = "",
} = process.env;

export const attributes = ["cn", "sAMAccountName", "mail", "memberOf"];

interface GetLdapUsersFilter {
  username?: string;
}

function searchOptions(filter: GetLdapUsersFilter = { username: "*" }) {
  return {
    filter: `(&(objectClass=person)(sAMAccountName=${filter.username || ""}))`,
    scope: "sub",
    attributes,
  } satisfies SearchOptions;
}

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

export async function createLdapClient(): Promise<Client> {
  const client = createClient({ url: `ldap://${LDAP_HOST}:${LDAP_PORT}` });

  if (!LDAP_USERNAME || !LDAP_PASSWORD) {
    throw new Error("LDAP credentials missing");
  }

  const clientAsynct = promisify(client.bind).bind(client);
  await clientAsynct(LDAP_USERNAME, LDAP_PASSWORD);

  return client;
}

export async function getUsers(filter?: GetLdapUsersFilter): Promise<user[]> {
  const client = await createLdapClient();

  return new Promise<user[]>((resolve, reject) => {
    client.search(LDAP_USERS, searchOptions(filter), (err, searchRes) => {
      if (err) reject("Search error");

      const users: user[] = [];

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
