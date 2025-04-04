import prisma from "@/configs/prisma.config";

export async function getAll(): Promise<IResponse> {
  const itemsView = await prisma.items_view.findMany();
  const itemsInLoan = await prisma.items_in_loan.findMany({
    where: { date_returned: null },
  });

  for (const itemView of itemsView) {
    if (itemView.Status) continue;

    const itemInLoan = itemsInLoan.find(
      ({ item_id }) => item_id === itemView.UUID
    );

    itemView.Status = itemInLoan ? "Lånt ud" : "Tilgængelig";
  }

  const headers = Object.keys(prisma.items_view.fields);

  return { status: 200, data: { headers, data: itemsView } };
}
