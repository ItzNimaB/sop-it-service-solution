import { Router } from "express";

import * as loansViewController from "@controllers/loans_view";

const router = Router();

router.get(["/", "/:id"], loansViewController.GetAll());

export default router;
