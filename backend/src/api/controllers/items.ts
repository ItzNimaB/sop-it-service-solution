import * as ItemsService from "@services/items";

export function GetOne(): IController {
  return async (req, res) => {
    const { UUID } = req.params;

    const response = await ItemsService.getOne(UUID);

    res.status(response.status).json(response.data);
  };
}

export function CreateOne(): IController {
  return async (req, res) => {
    const { product_id, amount, barcode_number } = req.body.data;

    const response = await ItemsService.createMultiple(
      product_id,
      amount,
      barcode_number
    );

    res.status(response.status).json(response.data);
  };
}
