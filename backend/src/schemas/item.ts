import { z } from "zod";

export const getItemSchema = z.object({
  id: z.coerce.number(),
});

export const createItemSchema = z.object({
  product_id: z.number(),
  amount: z.number(),
});
