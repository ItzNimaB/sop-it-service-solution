import { z } from "zod";

export const getTables = z.object({
  id: z.coerce.number(),
});
