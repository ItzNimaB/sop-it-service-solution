import { Router } from "express";

import * as usersViewController from "@controllers/users_view";
import { minModLevel } from "@middleware/auth";

const router = Router();

router.get("/", minModLevel(1), usersViewController.GetAll());

export default router;
