import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SearchOptions } from "ldapjs";

import { attributes, createLdapClient, formatEntryResult } from "./ldapHelper";

dotenv.config();

const { JWT_SECRET, NODE_ENV, LDAP_USERS, LDAP_ADMINS, LDAP_SUPERIORS } =
  process.env;

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Access denied" });

  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

  try {
    //TODO: Change this to be correct, instead of implicitly adding moderator
    const verified = verify(token, JWT_SECRET) as user;

    req.user = verified;

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ error: "Token expired" });

    return res.status(400).json({ error: "Invalid token" });
  }
}

// ** Replace with global interface
export async function ldapAuthenticate(
  username: user["username"],
  password: string,
  searchBase = LDAP_ADMINS
): Promise<user | null> {
  let resolve: any, reject: any;

  const promise = new Promise<user | null>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // if (["development", "test"].includes(process.env.NODE_ENV || "")) {
  //   resolve({
  //     date_created: new Date(),
  //     distiguishedName: "John Doe",
  //     firstName: "John",
  //     fullName: "John Doe",
  //     lastName: "Doe",
  //     mail: "johndoe@mail.com",
  //     moderatorLevel: 1,
  //     username: "jdoe",
  //     UUID: 792,
  //   }) as user;

  //   return promise;
  // }

  if (!searchBase) return reject(promise);

  const client = await createLdapClient();

  const searchOptions = {
    filter: `(sAMAccountName=${username.replace("@edu.sde.dk", "")})`,
    scope: "sub",
    attributes,
  } as SearchOptions;

  client.search(searchBase, searchOptions, (err, res) => {
    if (err) {
      client.unbind();
      reject("Search failed: " + err);
      return promise;
    }

    let user: user | null = null;

    res.on("searchEntry", (entry) => {
      user = formatEntryResult(entry);
    });

    res.on("end", (result) => {
      if (result?.status !== 0) {
        client.unbind();
        reject("Non-zero status from LDAP search: " + result?.status);
        return promise;
      }

      if (!user?.distinguishedName) {
        if (searchBase == LDAP_ADMINS)
          ldapAuthenticate(username, password, LDAP_USERS).catch(reject);
        client.unbind();
        reject("User DN not found: " + username);
        return promise;
      }

      client.bind(user.distinguishedName, password, (err) => {
        client.unbind();
        if (err) reject("User bind failed: " + username);
        if (!password) reject("No password provided");

        resolve(user);
      });
    });
  });

  return promise;
}
