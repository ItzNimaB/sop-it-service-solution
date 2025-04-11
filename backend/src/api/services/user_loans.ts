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

  const itemsInLoan = await prisma.items_in_loan.findMany({
    where: { date_returned: null },
  });

  for (const userLoan of userLoans) {
    if (userLoan.Produkt_status) continue;

    const itemInLoan = itemsInLoan.find(
      ({ item_id }) => item_id === userLoan.item_id
    );

    userLoan.Produkt_status = itemInLoan ? "Lånt ud" : "Tilgængelig";
  }

  const headers = Object.keys(prisma.user_loans.fields);

  return { status: 200, data: { headers, data: userLoans } };
}
