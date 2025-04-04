import { Router } from "express";

import * as loanController from "@controllers/loans";
import { minModLevel } from "@middleware/auth";
import * as loanMiddleware from "@middleware/loans";

const router = Router();

router.get(["/", "/:UUID"], loanMiddleware.Validate);
router.get("/:UUID/pdf", loanController.GetPdf());

router.use(minModLevel(1));

router.post("/", loanController.CreateOne());
router.patch("/return/item", loanController.ReturnLoan());

export default router;
