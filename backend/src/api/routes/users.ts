import { Router } from "express";

import { getLdapUsers } from "@/functions";
import { minModLevel } from "@middleware/auth";

const router = Router();

router.get("/ldap", minModLevel(1), async (req, res) => {
  getLdapUsers(res);
});

export default router;
