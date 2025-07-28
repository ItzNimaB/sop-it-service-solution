import { sign, verify } from "jsonwebtoken";

import env from "@/config/env";
import prisma from "@/config/prisma";
import { ldapAuthenticate } from "@/functions/auth";

const { JWT_SECRET } = env;

export async function login(
  username: string,
  password: string
): Promise<IResponse> {
  try {
    let user = await ldapAuthenticate(username, password);

    if (!user) return { status: 400, data: "Invalid credentials" };

    const dbUser = await prisma.user.findFirst({
      where: { username: user.username },
      select: { id: true },
    });

    let newUser = { id: 0 };

    if (!dbUser) {
      newUser = await prisma.user.create({
        data: { username: user.username },
      });
    }

    user.id = dbUser?.id || newUser.id;

    const token = sign(user, JWT_SECRET, { expiresIn: "1d" });

    return { status: 200, data: { user, token } };
  } catch (err) {
    console.log(err);

    return { status: 400, data: "Something went wrong" };
  }
}
