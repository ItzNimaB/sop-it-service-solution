import { z } from "zod";

export const createSchema = z.object({
  UUID: z.coerce.number().int().positive(),
  name: z.string(),
});
