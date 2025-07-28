import { Router } from "express";

import BaseController from "@controllers/base.controller";

import { Product } from ".prisma/client";

export const router = Router();

const controller = new BaseController<Product>("Product");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);

export default router;
