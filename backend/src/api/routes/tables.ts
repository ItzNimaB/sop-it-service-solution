import { Router } from "express";

import * as tableController from "@controllers/tables";
import { minModLevel } from "@middleware/auth";
import { Validate } from "@middleware/tables";

const router = Router();

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

router.use(["/:table", "/:table/:UUID"], Validate);

router.get("/:table", tableController.GetAll());
router.get("/:table/:UUID", tableController.GetOne());

router.use(minModLevel(1));

router.post("/:table", tableController.CreateOne());
router.patch("/:table/:UUID", tableController.UpdateOne());
router.delete("/:table/:UUID", minModLevel(2), tableController.DeleteOne());

export default router;
