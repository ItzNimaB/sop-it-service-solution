import { Router } from "express";

import { isProd, sendMail } from "@/functions";

const router = Router();

router.post("/", async (req, res) => {
  if (isProd()) return;

  const { to, subject, text } = req.body;

  const response = await sendMail({ to, subject, text });

  res.send(response);
});

export default router;
