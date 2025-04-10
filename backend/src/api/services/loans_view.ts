import prisma from "@/configs/prisma.config";
import { addFullname } from "@/functions";

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

  let loans = await prisma.loans.findMany({
    where: { user_id },
    select: { UUID: true },
  });

  const loansView = await prisma.loans_view.findMany({
    where: { UUID: { in: loans.map((loan) => loan.UUID) } },
  });

  await addFullname(loansView, "Laaner");

  let headers = Object.keys(prisma.loans_view.fields);

  return { status: 200, data: { headers, data: loansView } };
}
