import { autoGenZodSchema } from "@/services/autoGen";

import { z } from "zod";

export const fields: Field<departmentModel>[] = [
  {
    label: "Navn",
    binding: "name",
  },
  {
    label: "Kontaktperson",
    binding: "contact_name",
    required: false,
  },
  {
    label: "Kontaktperson email",
    binding: "contact_email",
    required: false,
  },
];

function emptyToNull(value: unknown) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

export const zodSchema = autoGenZodSchema(fields).extend({
  contact_name: z.preprocess(emptyToNull, z.string().max(255).nullish()),
  contact_email: z.preprocess(
    emptyToNull,
    z
      .string()
      .max(255)
      .email("Kontaktperson email er ikke en gyldig email")
      .nullish(),
  ),
});
