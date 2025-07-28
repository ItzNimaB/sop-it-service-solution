import dotenv from "dotenv";
import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";
import LdapStrategy from "passport-ldapauth";

import { getModeratorLevel } from "../functions";
import env from "./env";

dotenv.config();

const {
  LDAP_HOST,
  LDAP_PORT,
  LDAP_USERNAME,
  LDAP_PASSWORD,
  LDAP_BASE_DN,
  JWT_SECRET,
} = env;

export const attributes = ["cn", "sAMAccountName", "mail", "memberOf"];

export const LDAPOptions: LdapStrategy.Options = {
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
  new LdapStrategy(LDAPOptions, (req, user, done) => {
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

export const JWTOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(JWTOptions, (payload, done) => done(null, payload))
);

export const authenticateJWT = passport.authenticate("jwt", {
  session: false,
});

export default passport;
