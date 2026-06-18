import dotenv from "dotenv";
import passport from "passport";
import LdapStrategy from "passport-ldapauth";

import { getModeratorLevel } from "./functions";

dotenv.config();

const {
  LDAP_HOST = "",
  LDAP_PORT,
  LDAP_USERNAME,
  LDAP_PASSWORD,
  LDAP_BASE_DN = "",
  NODE_ENV,
  LDAP_ADMINS = "",
  LDAP_SUPERIORS = "",
} = process.env;

export const attributes = ["cn", "sAMAccountName", "mail", "memberOf"];

export const opts: LdapStrategy.Options = {
  server: {
    url: `ldap://${LDAP_HOST}:${LDAP_PORT}`,
    bindDN: LDAP_USERNAME,
    bindCredentials: LDAP_PASSWORD,
    searchBase: LDAP_BASE_DN,
    searchFilter: "(sAMAccountName={{username}})",
    searchAttributes: attributes,
  },
  passReqToCallback: true,
};

function getSingleValue(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] || "";

  return value || "";
}

function getArrayValue(value?: string | string[]) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;

  return [value];
}

passport.use(
  new LdapStrategy(opts, (req, user, done) => {
    if (!user) return done(null, false);

    const dn = getSingleValue(user.dn);
    const fullName = getSingleValue(user.cn);
    const [firstName = "", lastName = ""] = fullName.split(" ");
    const memberOf = getArrayValue(user.memberOf);

    const ldapUser: user = {
      dn,
      firstName,
      lastName,
      fullName,
      username: getSingleValue(user.sAMAccountName),
      mail: getSingleValue(user.mail),
      memberOf,
      moderatorLevel: getModeratorLevel({ dn, memberOf }),
    };

    return done(null, ldapUser);
  })
);

export default passport;
