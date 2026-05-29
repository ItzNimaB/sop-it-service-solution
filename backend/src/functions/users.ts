import { createUser, getUsers } from "./ldapHelper";

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

export async function createLdapUser(
  username: string,
  password: string | undefined,
  email?: string,
  passwordHash?: string
): Promise<IResponse> {
  try {
    const user = await createUser({ username, password, email, passwordHash });

    return { status: 200, data: user };
  } catch (error) {
    console.error("Error in LDAP client creation or binding:", error);

    if (error instanceof Error && error.message === "User already exists") {
      return { status: 400, data: error.message };
    }

    return { status: 500, data: "Internal server error" };
  }
}
