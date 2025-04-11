import prisma from "@/configs/prisma.config";

export async function getAll(): Promise<IResponse> {
  const userLoans = await prisma.user_loans.findMany();
  const itemsInLoan = await prisma.items_in_loan.findMany({
    where: { date_returned: null },
  });

  for (const userLoan of userLoans) {
    if (userLoan.Produkt_status) continue;

    const itemInLoan = itemsInLoan.find(
      ({ item_id }) => item_id === userLoan.UUID
    );

    userLoan.Produkt_status = itemInLoan ? "Lånt ud" : "Tilgængelig";
  }

  const headers = Object.keys(prisma.user_loans.fields);

  return { status: 200, data: { headers, data: userLoans } };
}
