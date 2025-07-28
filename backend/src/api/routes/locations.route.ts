import { Router } from "express";

import BaseController from "@controllers/base.controller";
import LocationsService from "@services/locations.service";

export const router = Router();

const controller = new BaseController(new LocationsService() as any);

router.get("/", controller.getAll);

export default router;
