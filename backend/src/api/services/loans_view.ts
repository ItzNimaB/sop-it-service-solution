import prisma from "@/config/prisma";
import { addFullname } from "@/functions";

export async function getAll(
  moderatorLevel?: number,
  username?: string,
  user_id?: number
): Promise<IResponse> {
  let user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user && !moderatorLevel) return { status: 401, data: "User not found" };

  user_id = moderatorLevel ? user_id : user?.id;

  let loans = await prisma.loan.findMany({
    where: { user_id },
    select: { id: true },
  });

  const loansView = await prisma.loans_view.findMany({
    where: { id: { in: loans.map((loan) => loan.id) } },
  });

  await addFullname(loansView, "Laaner");

  let headers = Object.keys(prisma.loans_view.fields);

  return { status: 200, data: { headers, data: loansView } };
}
