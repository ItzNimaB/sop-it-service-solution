import prisma from "@/configs/prisma.config";
import { Prisma } from "@prisma/client";

export function getFieldTypes(table: Prisma.ModelName) {
  let fieldTypes = {} as Record<string, string>;

  const fields = prisma[table].fields;

  Object.entries(fields).map(
    ([key, value]) => (fieldTypes[key] = value.typeName)
  );

  return fieldTypes;
}

export function convertToPrismaTypes(
  data: any,
  table: Prisma.ModelName
): typeof data {
  let fieldTypes = getFieldTypes(table);

  Object.entries(data).map(([key, value]) => {
    if (fieldTypes[key] == "Int") data[key] = Number(value);
  });

  return data;
}

export async function findReferenced(table: Prisma.ModelName) {
  const referenced = (await prisma.$queryRawUnsafe(
    `
  SELECT 
    TABLE_NAME, 
    COLUMN_NAME, 
    REFERENCED_TABLE_NAME, 
    REFERENCED_COLUMN_NAME 
  FROM 
    information_schema.KEY_COLUMN_USAGE 
  WHERE 
	  REFERENCED_TABLE_SCHEMA = 'sop' AND 
    REFERENCED_TABLE_NAME = '${table}';`
  )) as Array<{ TABLE_NAME: Prisma.ModelName }>;

  const referencedArray = referenced.map(({ TABLE_NAME }) => TABLE_NAME);

  return referencedArray;
}

export function findReferencing(table: Prisma.ModelName) {
  return `
  SELECT 
    TABLE_NAME, 
    COLUMN_NAME, 
    REFERENCED_TABLE_NAME, 
    REFERENCED_COLUMN_NAME
  FROM
    information_schema.KEY_COLUMN_USAGE 
  WHERE 
    TABLE_NAME = '${table}' AND
    REFERENCED_TABLE_NAME IS NOT NULL;`;
}

export function isProd(): boolean {
  const { NODE_ENV = "" } = process.env;
  return NODE_ENV === "production";
}
