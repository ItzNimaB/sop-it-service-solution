import { Router } from "express";

import BaseController from "@controllers/base.controller";

export const router = Router();

const controller = new BaseController("Building");

router.get("/", controller.getAll);

export default router;
