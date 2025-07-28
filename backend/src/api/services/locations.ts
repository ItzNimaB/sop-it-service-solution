import prisma from "@/config/prisma";

export async function getAll(): Promise<IResponse> {
  const buildings = await prisma.building.findMany({
    include: { zones: true },
  });

  return { status: 200, data: buildings };
}
