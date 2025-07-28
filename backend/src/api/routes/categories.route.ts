import { Router } from "express";

import BaseController from "@controllers/base.controller";

export const router = Router();

const controller = new BaseController("Category");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.patch("/:id", controller.update);
router.post("/", controller.create);
router.delete("/:id", controller.delete);

export default router;
