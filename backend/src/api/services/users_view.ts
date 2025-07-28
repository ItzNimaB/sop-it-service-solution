import prisma from "@/config/prisma";
import { addFullname, getUsers } from "@/functions";
import { Prisma, User } from "@prisma/client";

Prisma;
export async function getAll(): Promise<IResponse> {
  const ldapUsers = await getUsers();

  const dbUsers = await prisma.user.findMany();

  const users: User[] = [];

  for (let ldapUser of ldapUsers) {
    let dbUser = dbUsers.find(({ username }) => username == ldapUser.username);

    if (!dbUser) {
      const newUser = await prisma.user.create({
        data: { username: ldapUser.username },
      });

      dbUser = {
        id: newUser.id,
        Brugernavn: newUser.username,
        Navn: ldapUser.fullName,
        Oprettet: new Date(),
        Opdateret: new Date(),
      };
    }

    users.push(dbUser);
  }

  await addFullname(users, "Brugernavn");

  return { status: 200, data: users };
}
