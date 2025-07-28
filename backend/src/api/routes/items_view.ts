import { Router } from "express";

import * as itemsViewController from "@controllers/items_view";

const router = Router();

router.get("/", itemsViewController.GetAll());

export default router;
