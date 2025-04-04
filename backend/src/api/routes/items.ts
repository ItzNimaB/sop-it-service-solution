import { Router } from "express";

import * as itemsController from "@controllers/items";
import { minModLevel } from "@middleware/auth";

const router = Router();

router.get("/:UUID", itemsController.GetOne());
router.post("/", router.use(minModLevel(1)), itemsController.CreateOne());

export default router;
