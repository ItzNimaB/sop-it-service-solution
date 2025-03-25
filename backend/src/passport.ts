import dotenv from "dotenv";
import passport from "passport";
import LdapStrategy from "passport-ldapauth";

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

export const attributes = [
  "distinguishedName",
  "cn",
  "sAMAccountName",
  "mail",
  "whenCreated",
  "whenChanged",
  "lastLogon",
  "memberOf",
];

const opts: LdapStrategy.Options = {
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
    console.log(user);

    done(null, user);
  })
);

export default passport;
