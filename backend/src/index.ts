import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import cron from "node-cron";

import * as Routes from "@/api/routes";
import prisma from "@/configs/prisma.config";
import { authenticateUser, sendMailToExpiredLoans } from "@/functions";

import passport from "./passport";

dotenv.config();

const app = express();

var origin: string | string[] = "http://localhost:5173";

if (process.env.FRONTEND_URL) origin = process.env.FRONTEND_URL.split(",");

app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("json spaces", 4);
app.use(cookieParser());
app.use(passport.initialize());

const router = Router();

router.use("/auth", Routes.Auth);

router.use(async (req, res, next) => {
  authenticateUser(req, res, next);
});

router.use("/loans", Routes.Loans);
router.use("/loans_view", Routes.Loans_view);
router.use("/mail", Routes.Mail);
router.use("/items", Routes.Items);
router.use("/items_view", Routes.Items_view);
router.use("/users_view", Routes.Users_view);
router.use("/locations", Routes.Locations);
router.use("/user_loans", Routes.User_loans);

router.use("", Routes.tables);

app.use("/api", router);

const port = process.env.BACKEND_PORT || 5000;

const cronShedule = "0 8 * * 1-5";

// cron.schedule(cronShedule, sendMailToExpiredLoans, {
//   // runOnInit: false
// });

app.listen(port, async () => {
  await prisma.$connect();

  console.log(`Server listening on port ${port}`);
});
