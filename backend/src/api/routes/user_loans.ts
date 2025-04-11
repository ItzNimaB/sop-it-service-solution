import { Router } from "express";

import * as userLoansController from "@controllers/user_loans";

const router = Router();

router.get("/", userLoansController.GetAll());

export default router;
