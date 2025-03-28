import { Router } from "express";

import passport from "@/passport";
import * as authController from "@controllers/auth";
import { verifyLDAP } from "@middleware/auth";

const router = Router();

// router.post("/login", authController.Login());
router.post(
  "/login",
  passport.authenticate("ldapauth", { session: false }, console.log),
  (req, res) => res.send(req.user)
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
