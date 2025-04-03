import { prismaGetRefs as prisma } from "@/configs/prisma.config";
import { convertToPrismaTypes } from "@/functions";
import findPrismaSchema from "@/functions/findPrismaSchema";
import { getTables } from "@/schemas/tables";
import { Prisma } from "@prisma/client";

export async function getAll(
  table: Prisma.ModelName,
  filter: any = {}
): Promise<IResponse> {
  if (filter.UUID) filter.UUID = Number(filter.UUID);

  for (const [key, value] of Object.entries(filter)) {
    if (value === "null") filter[key] = null;
  }

  filter = convertToPrismaTypes(filter, table);

  try {
    let result = await (prisma[table] as any).findMany({ where: filter });

    const headers = Object.keys(prisma[table].fields);

    // ?withHeaders=true

    return { status: 200, data: { headers, data: result } };
  } catch (error: any) {
    return { status: 400, data: { error: error.message } };
  }
}

export async function getOne(
  table: Prisma.ModelName,
  UUID: string | number,
  filter?: any,
  include?: string[]
): Promise<IResponse> {
  const { data, error } = getTables.safeParse({ table, UUID });

  if (error) return { status: 400, data: error };

  try {
    const result = await (prisma[table] as any).findUnique({
      where: { UUID: data.UUID, ...filter },
      include,
    });

    return { status: 200, data: result };
  } catch (error: any) {
    return { status: 400, data: { error: error.message } };
  }
}

export async function createOne(
  table: Prisma.ModelName,
  values: any
): Promise<IResponse> {
  try {
    const prismaTable = prisma[table].fields;

    const createSchema = await findPrismaSchema("createSchema", table);

    if (createSchema) {
      const { error } = createSchema.safeParse(values);

      if (error) {
        return {
          status: 400,
          data: { error: error.flatten() },
        };
      }
    }

    for (const [key, value] of Object.entries(prismaTable) as any) {
      if (value.typeName === "Int" && values[key]) {
        values[key] = Number(values[key]);
      }
    }

    const newRow = await (prisma[table] as any).create({ data: values });

    return { status: 201, data: { ...newRow, id: newRow.UUID } };
  } catch (error: any) {
    return { status: 400, data: { error: error.message } };
  }
}

export async function updateOne(
  table: Prisma.ModelName,
  UUID: string | number,
  values: any
): Promise<IResponse> {
  try {
    if (!values || Object.keys(values).length === 0)
      return { status: 400, data: { error: "No data provided" } };

    delete values["UUID"];
    delete values["date_created"];
    delete values["date_updated"];

    const updateSchema = await findPrismaSchema("updateSchema", table);

    if (updateSchema) {
      const { error } = updateSchema.safeParse(values);

      if (error) {
        return {
          status: 400,
          data: { error: error.flatten() },
        };
      }
    }

    const result = await (prisma[table] as any).update({
      where: { UUID: Number(UUID) },
      data: values,
    });

    return { status: 200, data: result };
  } catch (error: any) {
    return { status: 400, data: { error: error.message } };
  }
}

export async function deleteOne(
  table: Prisma.ModelName,
  UUID: string | number
): Promise<IResponse> {
  try {
    const result = await (prisma[table] as any).delete({
      where: { UUID: Number(UUID) },
    });

    return { status: 200, data: result };
  } catch (error: any) {
    return { status: 400, data: { error: error.message } };
  }
}
