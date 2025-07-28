import { Router } from "express";

import { minModLevel } from "@/functions/auth";
import BaseController from "@controllers/base.controller";
import * as loanController from "@controllers/loans.controller";
import * as loanMiddleware from "@middleware/loans";

const router = Router();

const LoanController = new BaseController("Loan");

router.get(["/", "/:id"], loanMiddleware.Validate);
router.get("/:id/pdf", loanController.GetPdf());

router.use(minModLevel(1));

router.get("/", LoanController.getAll);
router.post("/", loanController.CreateOne());
router.patch("/return/item", loanController.ReturnLoan());

export default router;
