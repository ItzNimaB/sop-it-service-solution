import { z } from "zod";

export const getItemSchema = z.object({
  UUID: z.coerce.number(),
});

export const createItemSchema = z.object({
  product_id: z.number(),
  amount: z.number(),
  barcode_number: z.number().nullish(),
  product_status_id: z.number().nullish(),
  department_id: z.number().nullish(),
  description: z.string().nullish(),
});
