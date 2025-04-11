import { Router } from "express";

import * as userLoansController from "@controllers/user_loans";
import { minModLevel } from "@middleware/auth";

const router = Router();

router.get("/", minModLevel(1), userLoansController.GetAll());

export default router;
