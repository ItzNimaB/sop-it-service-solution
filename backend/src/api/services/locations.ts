import prisma from "@/configs/prisma.config";

export class LocationsService {
  public get(): Promise<IResponse["data"]> {
    const buildings = prisma.buildings.findMany({
      include: { zones: true },
    });

    return buildings;
  }
}
export async function getAll(): Promise<IResponse> {
  const buildings = await prisma.buildings.findMany({
    include: { zones: true },
  });

  return { status: 200, data: buildings };
}
