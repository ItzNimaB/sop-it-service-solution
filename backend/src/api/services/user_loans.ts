import prisma from "@/configs/prisma.config";

export async function getAll(
  moderatorLevel?: number,
  username?: string,
  user_id?: number
): Promise<IResponse> {
  let user = await prisma.users.findFirst({
    where: { username },
  });

  if (!user && !moderatorLevel) return { status: 401, data: "User not found" };

  user_id = moderatorLevel ? user_id : user?.UUID;

  const userLoans = await prisma.user_loans.findMany({
    where: { user_id },
  });

  const headers = Object.keys(prisma.user_loans.fields);

  return { status: 200, data: { headers, data: userLoans } };
}
