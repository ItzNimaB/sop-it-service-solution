import { prismaGetRefs as prisma } from "@/configs/prisma.config";
import { createItemSchema, getItemSchema } from "@/schemas/item";
import { Prisma, items } from "@prisma/client";

export async function getOne(UUID?: string | number): Promise<IResponse> {
  const { data, error } = getItemSchema.safeParse({ UUID });

  if (error) return { status: 400, data: error };

  const item = await prisma.items.findUnique({
    where: { UUID: data.UUID || undefined },
    include: {
      items_in_loan: {
        include: { loans: { include: { users_loans_user_idTousers: true } } },
      },
    },
  });

  return { status: 200, data: item };
}

interface CreateItemExtras {
  product_status_id?: number | null;
  department_id?: number | null;
  description?: string | null;
}

export async function createMultiple(
  product_id: number | string,
  amount = 1,
  barcode_number?: number | null,
  extras: CreateItemExtras = {}
): Promise<IResponse> {
  product_id = Number(product_id);
  const validated = createItemSchema.safeParse({
    product_id,
    amount,
    barcode_number,
    ...extras,
  });

  if (validated.error) return { status: 400, data: validated.error };

  const transactions: Prisma.Prisma__itemsClient<items>[] = [];

  for (let i = 0; i < validated.data.amount; i++) {
    const itemTransaction = prisma.items.create({
      data: {
        product_id: validated.data.product_id,
        barcode_number: validated.data.barcode_number,
        product_status_id: validated.data.product_status_id,
        department_id: validated.data.department_id,
        description: validated.data.description,
      },
    });

    transactions.push(itemTransaction);
  }

  const item = await prisma.$transaction(transactions);

  return { status: 201, data: item };
}
