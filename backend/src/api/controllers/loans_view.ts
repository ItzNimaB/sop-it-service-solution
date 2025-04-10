import * as loansViewService from "@services/loans_view";

export function GetAll(): IController {
  return async (req, res) => {
    const { moderatorLevel, username } = req.user || {};
    let user_id = req.query.user_id;

    const response = await loansViewService.getAll(
      moderatorLevel,
      username,
      user_id ? Number(user_id) : undefined
    );

    res.status(response.status).json(response.data);
  };
}
