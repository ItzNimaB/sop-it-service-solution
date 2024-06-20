import { autoGenZodSchema } from "@services/autoGen";

export const fields: Field[] = [{ label: "Navn", binding: "name" }];

export const zodSchema = autoGenZodSchema(fields);
