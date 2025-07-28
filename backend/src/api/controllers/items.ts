import * as ItemsService from "@services/items";

export function GetOne(): IController {
  return async (req, res) => {
    const { id } = req.params;

    const response = await ItemsService.getOne(id);

    res.status(response.status).json(response.data);
  };
}

export function CreateOne(): IController {
  return async (req, res) => {
    const { product_id, amount } = req.body.data;

    const response = await ItemsService.createMultiple(product_id, amount);

    res.status(response.status).json(response.data);
  };
}
