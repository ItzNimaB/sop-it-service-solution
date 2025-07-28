import { Router } from "express";
import { sign } from "jsonwebtoken";

import env from "@/config/env";
import passport, { authenticateJWT } from "@/config/passport";
import prisma from "@/config/prisma";
import * as authController from "@controllers/auth";

export const isPublic = true;

const { JWT_SECRET } = env;

const router = Router();

router.post(
  "/login",
  passport.authenticate("ldapauth", { session: false }),
  async (req, res) => {
    if (!req.user) return res.status(401);

    let user = await prisma.user.findFirst({
      where: { username: req.user.username },
    });

    user ??= await prisma.user.create({
      data: { username: req.user.username },
    });

    req.user.id = user.id;

    const token = sign(req.user, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json(req.user);
  }
);

router.post("/validate", authenticateJWT, (req, res) => res.json(req.user));
router.get("/cookies", (req, res) => res.json(req.cookies));
router.post("/logout", (req, res) => res.clearCookie("token").sendStatus(200));

export default router;
