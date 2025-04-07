import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import { readFileSync } from "fs";
import cron from "node-cron";
import path from "path";
import swaggerUi from "swagger-ui-express";

import * as Routes from "@/api/routes";
import { RegisterRoutes } from "@/api/routes/routes";
import prisma from "@/configs/prisma.config";
import { authenticateUser, sendMailToExpiredLoans } from "@/functions";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";

import passport from "./passport";
import { options, swaggerSpec } from "./swagger";
import { registry } from "./zod";
import "./schemas/brands";

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

RegisterRoutes(app);

const router = Router();

const swaggerDocument = JSON.parse(
  readFileSync(path.join(__dirname, "../dist/swagger.json"), "utf8")
);

const generator = new OpenApiGeneratorV3(registry.definitions);

const docs = generator.generateDocument(
  options.definition as OpenAPIObjectConfig
);

router.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

router.use("/auth", Routes.Auth);

router.use(async (req, res, next) => {
  authenticateUser(req, res, next);
});

router.use("/loans", Routes.Loans);
router.use("/loans_view", Routes.Loans_view);
router.use("/mail", Routes.Mail);
router.use("/items", Routes.Items);
router.use("/items_view", Routes.Items_view);
router.use("/users", Routes.Users);
router.use("/users_view", Routes.Users_view);
router.use("/locations", Routes.Locations);

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
