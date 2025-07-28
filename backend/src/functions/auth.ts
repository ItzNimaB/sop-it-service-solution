import dotenv from "dotenv";
import LdapAuth from "ldapauth-fork";
import { promisify } from "util";

import { LDAPOptions } from "@/config/passport";

dotenv.config();

export async function ldapAuthenticate(
  username: string,
  password: string
): Promise<user | null> {
  const ldap = new LdapAuth(LDAPOptions.server);

  const authenticateAsync = promisify<string, string, user>(
    ldap.authenticate.bind(ldap)
  );

  try {
    const user = await authenticateAsync(username, password);
    return user;
  } catch (err) {
    console.error("LDAP authentication error:", err);
    return null;
  }
}

export function minModLevel(level: number): IMiddleware {
  return (req, res, next) => {
    const { moderatorLevel } = req.user || {};

    if (!moderatorLevel || moderatorLevel < level) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
