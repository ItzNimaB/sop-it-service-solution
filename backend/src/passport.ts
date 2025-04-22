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

passport.use(
  new LdapStrategy(opts, (req, user, done) => {
    if (!user) return done(null, false);

    const ldapUser: user = {
      dn: user.dn,
      firstName: user.cn.split(" ")[0],
      lastName: user.cn.split(" ")[1],
      fullName: user.cn,
      username: user.sAMAccountName,
      mail: user.mail,
      memberOf: user.memberOf,
      moderatorLevel: getModeratorLevel(user),
    };

    return done(null, ldapUser);
  })
);

export default passport;
