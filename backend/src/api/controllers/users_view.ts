import * as usersViewService from "@services/users_view";

export function GetAll(): IController {
  return async (req, res) => {
    const response = await usersViewService.getAll();

    res.status(response.status).json(response.data);
  };
}