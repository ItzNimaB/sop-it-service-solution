import { z } from "zod";

export const createLoanSchema = z.object({
  loan: z.object({
    user_id: z.coerce.number(),
    date_of_return: z.coerce.date().optional(),
    helpdesk_personel_id: z.coerce.number().optional(),
    loan_length: z.coerce.number(),
  }),
  products: z.array(
    z.object({
      id: z.coerce.number(),
      withBag: z.boolean().optional(),
      withLock: z.boolean().optional(),
    })
  ),
  personel_username: z.string(),
  personel_password: z.string(),
});
