import { z } from "zod";

const contactName = z.string().trim().max(255).nullish();
const contactEmail = z
  .string()
  .trim()
  .max(255)
  .email("Ugyldig email")
  .nullish();

export const createSchema = z.object({
  name: z.string().trim().min(1).max(255),
  contact_name: contactName,
  contact_email: contactEmail,
});

export const updateSchema = createSchema.partial();
