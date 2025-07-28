import prisma from "@/config/prisma";
import { Building, Zone } from "@/types/prisma";

import BaseService from "./base.service";

export interface Location extends Building {
  zones: Zone[];
}

export default class LocationsService extends BaseService<Building> {
  constructor() {
    super("building");
  }

  getAll = async () => {
    const buildings = await prisma.building.findMany({
      include: { zones: true },
    });

    return { status: 200, data: buildings };
  };
}
