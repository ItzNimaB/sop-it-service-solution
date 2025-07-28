import { Router } from "express";

import { minModLevel } from "@/functions/auth";
import BaseController from "@controllers/base.controller";
import * as itemsController from "@controllers/items";
import ItemService from "@services/items.service";

const router = Router();

const controller = new BaseController(new ItemService());

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", minModLevel(1), controller.create);
// router.get("/:id", itemsController.GetOne());
// router.post("/", minModLevel(1), itemsController.CreateOne());

export default router;
