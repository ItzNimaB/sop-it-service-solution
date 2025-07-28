import * as ItemsViewService from "@services/items_view";

export function GetAll(): IController {
  return async (req, res) => {
    let filter = req.query as any;

    const response = await ItemsViewService.getAll(filter);

    res.status(response.status).json(response.data);
  };
}
