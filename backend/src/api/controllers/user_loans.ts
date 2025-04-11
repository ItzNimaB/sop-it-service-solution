import * as UserLoansService from "@services/user_loans";

export function GetAll(): IController {
  return async (req, res) => {
    const { moderatorLevel, username } = req.user || {};
    let user_id = req.query.user_id;

    const response = await UserLoansService.getAll(
      moderatorLevel,
      username,
      user_id ? Number(user_id) : undefined
    );

    res.status(response.status).json(response.data);
  };
}
