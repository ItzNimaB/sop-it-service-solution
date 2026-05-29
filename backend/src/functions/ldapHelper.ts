import dotenv from "dotenv";
import { Client, SearchEntry, SearchOptions, createClient } from "ldapjs";
import { createHash, randomBytes } from "crypto";
import { promisify } from "util";

dotenv.config();

const {
  LDAP_HOST,
  LDAP_PORT,
  LDAP_USERNAME,
  LDAP_PASSWORD,
  LDAP_USERS = "",
  LDAP_ADMINS = "",
  LDAP_SUPERIORS = "",
} = process.env;

export const attributes = ["cn", "sAMAccountName", "mail", "memberOf"];
const defaultUserOu =
  "OU=OU_Programmoer,OU=OU_Elever,OU=OU_IT-SKP,OU=OU_Main,DC=ITSKP-ODENSE,DC=dk";
const defaultMemberOf =
  "CN=SG_Programmoer,OU=OU_Programmoer,OU=OU_Elever,OU=OU_IT-SKP,OU=OU_Main,DC=ITSKP-ODENSE,DC=dk";
const sambaSidBase = "S-1-5-21-3623811015-3361044348-30300820";

interface GetLdapUsersFilter {
  username?: string;
}

interface CreateLdapUserInput {
  username: string;
  password?: string;
  passwordHash?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dn?: string;
  ou?: string;
  memberOf?: string[];
  sambaSid?: string;
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

function hashPassword(password: string) {
  const salt = randomBytes(8);
  const hash = createHash("sha1")
    .update(Buffer.concat([Buffer.from(password), salt]))
    .digest();

  return `{SSHA}${Buffer.concat([hash, salt]).toString("base64")}`;
}

function buildSambaSid() {
  const rid = 2000 + Math.floor(Math.random() * 100000);

  return `${sambaSidBase}-${rid}`;
}

function buildUserEntry({
  username,
  password,
  passwordHash,
  email = `${username}@edu.sde.dk`,
  firstName,
  lastName = username,
  memberOf = [defaultMemberOf],
  sambaSid = buildSambaSid(),
}: CreateLdapUserInput) {
  const givenName = firstName || username;
  const cn = `${givenName} ${lastName}`;

  return {
    objectClass: [
      "top",
      "inetOrgPerson",
      "sambaSamAccount",
      "person",
      "organizationalPerson",
    ],
    sn: lastName,
    givenName,
    displayName: cn,
    cn,
    mail: email,
    memberOf,
    sAMAccountName: username,
    userPassword: passwordHash || hashPassword(password || ""),
    sambaSID: sambaSid,
  };
}

export async function createUser(data: CreateLdapUserInput): Promise<user> {
  if (!data.username || (!data.password && !data.passwordHash)) {
    throw new Error("Username and password are required");
  }

  const [existingUser] = await getUsers({ username: data.username });
  if (existingUser) throw new Error("User already exists");

  const client = await createLdapClient();
  const dn =
    data.dn || `CN=${data.username},${data.ou || defaultUserOu}`;

  try {
    const addAsync = promisify(client.add).bind(client);
    await addAsync(dn, buildUserEntry(data));

    const [createdUser] = await getUsers({ username: data.username });
    if (!createdUser) throw new Error("User was created but could not be read");

    return createdUser;
  } finally {
    client.unbind((err) => {
      if (err) console.error("Error in unbinding: ", err);
    });
  }
}

export function createLdapPasswordHash(password: string) {
  return hashPassword(password);
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
