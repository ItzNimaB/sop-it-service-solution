import { NextFunction, Request, Response } from "express";

import passport from "@/passport";

export const unauthorizedResponse = {
  status: 401,
  message: "Unauthorized",
};

export function verifyLDAP(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate(
    "ldapauth",
    { session: false },
    (err: number, user: Express.User) => {
      if (err) return res.status(err).json(unauthorizedResponse);

      if (!user) {
        return res.status(401).json(unauthorizedResponse);
      }

      req.user = user;
      next();
    }
  )(req, res, next);
}
