import { NextFunction, Request, Response } from "express";

import prisma from "@/config/prisma";

export async function Validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const moderator = req.user?.moderatorLevel;

  if (moderator) return next();

  if (req.user?.username) return res.sendStatus(401);

  let user = await prisma.users.findFirst({
    where: { username: req.user?.username },
  });

  if (!user || !moderator) return res.sendStatus(401);

  let user_id = user.id;

  req.query.user_id = user_id.toString();

  return next();
}
