import { Router } from "express";

import { minModLevel } from "@/functions/auth";
import * as usersViewController from "@controllers/users_view";

const router = Router();

router.get("/", minModLevel(1), usersViewController.GetAll());

export default router;
