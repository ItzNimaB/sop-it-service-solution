import { Router } from "express";
import { sign } from "jsonwebtoken";

import prisma from "@/configs/prisma.config";
import passport from "@/passport";
import * as authController from "@controllers/auth";
import { verifyLDAP } from "@middleware/auth";

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

const router = Router();

// router.post("/login", authController.Login());
router.post(
  "/login",
  passport.authenticate("ldapauth", { session: false }),
  async (req, res) => {
    if (!req.user) return res.status(401);

    const token = sign(req.user, JWT_SECRET, { expiresIn: "1d" });

    let user = await prisma.users.findFirst({
      where: { username: req.user.username },
    });

    if (!user) {
      user = await prisma.users.create({
        data: { username: req.user.username },
      });
    }

    req.user.UUID = user.UUID;

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json(req.user);
  }
);
router.post("/validate", authController.Validate());

router.get("/cookies", (req, res) => {
  res.json(req.cookies);
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export default router;
