import prisma from "@/config/prisma";
import { createItemSchema, getItemSchema } from "@/schemas/item";
import { Item, Prisma } from "@prisma/client";

import BaseService, { PrismaFindManyArgs } from "./base.service";

export default class ItemService extends BaseService<Item> {
  constructor() {
    super("item");
  }

  getAll = async (findManyArgs: PrismaFindManyArgs = {}) => {
    const items = await prisma.item.findMany({
      include: {
        product: true,
        product_status: true,
        item_in_loans: { include: { loan: { include: { loaner: true } } } },
      },
    });

    return { status: 200, data: items };
  };

  getById = async (id?: string | number): Promise<IResponse> => {
    const { data, error } = getItemSchema.safeParse({ id });

    if (error) return { status: 400, data: error };

    const item = await prisma.item.findUnique({
      where: { id: data.id || undefined },
      include: {
        item_in_loans: { include: { loan: { include: { loaner: true } } } },
      },
    });

    return { status: 200, data: item };
  };

  createMultiple = async (
    product_id: number | string,
    amount = 1
  ): Promise<IResponse> => {
    product_id = Number(product_id);
    const validated = createItemSchema.safeParse({ product_id, amount });

    if (validated.error) return { status: 400, data: validated.error };

    const transactions: Prisma.Prisma__ItemClient<Item>[] = [];

    for (let i = 0; i < validated.data.amount; i++) {
      const itemTransaction = prisma.item.create({
        data: { product_id: validated.data.product_id },
      });

      transactions.push(itemTransaction);
    }

    const item = await prisma.$transaction(transactions);

    return { status: 201, data: item };
  };
}
