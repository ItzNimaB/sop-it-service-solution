import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import cron from "node-cron";
import swaggerUi from "swagger-ui-express";

// import * as Routes from "@/api/routes";
import Auth from "@/api/routes/auth";
import env from "@/config/env";
import prisma from "@/config/prisma";
import { sendMailToExpiredLoans } from "@/functions";

import swaggerJson from "../prisma/openapi/openapi.json";
import passport, { authenticateJWT } from "./config/passport";
import { importAllRoutes } from "./functions/routesBundler";

dotenv.config();

const app = express();

var origin: string | string[] = "http://localhost:5173";

if (env.FRONTEND_URL) origin = env.FRONTEND_URL.split(",");

app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("json spaces", 4);
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

export const router = Router();

router.use("/auth", Auth);

router.use(authenticateJWT);

importAllRoutes(["auth"]);

app.use("/api", router);

const cronShedule = "0 8 * * 1-5";

// cron.schedule(cronShedule, sendMailToExpiredLoans, {
//   // runOnInit: false
// });

app.listen(env.BACKEND_PORT, async () => {
  await prisma.$connect();

  console.log(`Server listening on port ${env.BACKEND_PORT}`);
});
