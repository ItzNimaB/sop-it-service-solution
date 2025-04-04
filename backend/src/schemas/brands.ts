import { z } from "zod";

export const createSchema = z.object({
  name: z.string(),
});
