import { Router } from "express";

import { Brand } from "@/types/prisma";
import BaseController from "@controllers/base.controller";

const router = Router();

const controller = new BaseController<Brand>("Brand");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.patch("/:id", controller.update);
router.post("/", controller.create);
router.delete("/:id", controller.delete);

export default router;
