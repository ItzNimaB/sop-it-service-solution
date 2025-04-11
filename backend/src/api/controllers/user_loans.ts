import * as UserLoansService from "@services/user_loans";

export function GetAll(): IController {
  return async (req, res) => {
    const response = await UserLoansService.getAll();

    res.status(response.status).json(response.data);
  };
}
