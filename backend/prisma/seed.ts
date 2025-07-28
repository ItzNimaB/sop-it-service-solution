import { isProd } from "@/config/env";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.building.upsert({
    where: { id: 23 },
    update: {},
    create: { id: 23, name: "MU7" },
  });
  await prisma.building.upsert({
    where: { id: 24 },
    update: {},
    create: { id: 24, name: "MU8" },
  });

  await prisma.productStatus.createMany({
    data: [
      { id: 1, name: "Broken" },
      { id: 2, name: "Deleted(Given away)" },
      { id: 3, name: "Deleted(Thrown away)" },
    ],
  });

  await prisma.recipientType.createMany({
    data: [
      { id: 1, name: "Til person" },
      { id: 2, name: "Til lokale" },
    ],
  });

  await prisma.zone.createMany({
    data: [
      { name: "zone1", building_id: 23, floor_level: 0 },
      { name: "zone2", building_id: 23, floor_level: 0 },
      { name: "zone3", building_id: 23, floor_level: 0 },
      { name: "zone5", building_id: 23, floor_level: 0 },
      { name: "zone6", building_id: 23, floor_level: 0 },
      { name: "zone8", building_id: 23, floor_level: 0 },
      { name: "zone9", building_id: 23, floor_level: 0 },
      { name: "22", building_id: 24, floor_level: 0 },
      { name: "30", building_id: 24, floor_level: 0 },
      { name: "24", building_id: 24, floor_level: 0 },
      { name: "31", building_id: 24, floor_level: 0 },
      { name: "25", building_id: 24, floor_level: 0 },
      { name: "32", building_id: 24, floor_level: 0 },
      { name: "33", building_id: 24, floor_level: 0 },
      { name: "z29a", building_id: 24, floor_level: 0 },
      { name: "z29b", building_id: 24, floor_level: 0 },
      { name: "z29c", building_id: 24, floor_level: 0 },
      { name: "36", building_id: 24, floor_level: 0 },
      { name: "37", building_id: 24, floor_level: 0 },
      { name: "38", building_id: 24, floor_level: 0 },
      { name: "06", building_id: 24, floor_level: -1 },
      { name: "016", building_id: 24, floor_level: -1 },
      { name: "015", building_id: 24, floor_level: -1 },
    ],
  });

  if (isProd) return;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
