import { createUser, getUsers } from "./ldapHelper";

type PerfTracker = {
  mark: (label: string, meta?: Record<string, unknown>) => void;
  time: <T>(label: string, fn: () => T | Promise<T>) => Promise<T>;
};

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
  usernameKey: string,
  perf?: PerfTracker
) {
  const { data } = perf
    ? await perf.time("addFullname.getLdapUsers", getLdapUsers)
    : await getLdapUsers();
  const ldapUsers = Array.isArray(data) ? data : [];
  const usersByUsername = new Map(
    ldapUsers
      .filter(({ username }: any) => username !== undefined)
      .map(({ username, fullName }: any) => [username, fullName || ""])
  );

  perf?.mark("addFullname.ldapUsers.loaded", {
    ldapUserCount: ldapUsers.length,
    loanCount: loans.length,
    usernameKey,
  });

  const matchFullNames = () => {
    for (let loan of loans) {
      loan.Navn = usersByUsername.get(loan[usernameKey]) || "";
    }
  };

  await perf?.time("addFullname.matchFullNames", () => {
    matchFullNames();
  });

  if (!perf) {
    matchFullNames();
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
