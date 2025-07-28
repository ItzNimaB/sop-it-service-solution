import { Item } from "@/types/prisma";
import ItemService from "@services/items.service";

import BaseController from "./base.controller";

export default class ItemsController extends BaseController<Item> {
  service: ItemService = new ItemService();

  constructor() {
    super("Item");
  }

  createMultiple: IController = async (req, res) => {
    const { product_id, amount } = req.body;

    const { status, data } = await this.service.createMultiple(
      product_id,
      amount
    );

    return res.status(status).json(data);
  };
}
