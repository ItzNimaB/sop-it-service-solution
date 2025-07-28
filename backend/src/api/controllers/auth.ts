import * as AuthService from "@services/auth";

export function Login(): IController {
  return async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
      return res.json({ error: "Missing credentials" });

    const response = await AuthService.login(username, password);

    if (response.data.token)
      res.cookie("token", response.data.token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

    res.status(response.status).json(response.data.user);
  };
}
