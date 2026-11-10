import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.buildings.upsert({
    where: { UUID: 23 },
    update: {},
    create: { UUID: 23, name: "MU7" },
  });
  await prisma.buildings.upsert({
    where: { UUID: 24 },
    update: {},
    create: { UUID: 24, name: "MU8" },
  });

  await prisma.product_status.createMany({
    data: [
      { UUID: 1, name: "Broken" },
      { UUID: 2, name: "Deleted(Given away)" },
      { UUID: 3, name: "Deleted(Thrown away)" },
    ],
  });

  await prisma.departments.createMany({
    data: [
      { UUID: 1, name: "Hovedforløb" },
      { UUID: 2, name: "Skoleoplæring" },
      { UUID: 3, name: "Mediegrafikere" },
    ],
    skipDuplicates: true,
  });

  await prisma.recipient_type.createMany({
    data: [
      { UUID: 1, name: "Til person" },
      { UUID: 2, name: "Til lokale" },
    ],
  });

  await prisma.zones.createMany({
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
