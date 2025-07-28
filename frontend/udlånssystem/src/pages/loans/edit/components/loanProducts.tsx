import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import useData from "@/hooks/useData";

import type { items_from_loans } from "@prisma";

export default function LoanProducts() {
  const { id } = useParams();

  const { t } = useTranslation();

  const [itemsFromLoans] = useData<items_from_loans[]>(
    "items_from_loans?loan_id=" + id,
  );

  if (!itemsFromLoans?.length) return null;

  const activeItems = itemsFromLoans.filter((item) => !item.Returneret);
  const returnedItems = itemsFromLoans.filter((item) => item.Returneret);

  return (
    <Accordion
      type="multiple"
      className="flex flex-col gap-5"
      defaultValue={["activeItems"]}
    >
      {activeItems.length > 0 && (
        <AccordionItem value="activeItems" className="flex flex-col gap-1">
          <AccordionTrigger className="!border-0 px-2 focus:outline-none">
            {t("Loaned products")}: ({activeItems.length})
          </AccordionTrigger>
          <AccordionContent className="flex flex-col">
            {activeItems.map((item, i) => (
              <ItemLink item={item} key={i} />
            ))}
          </AccordionContent>
        </AccordionItem>
      )}

      {returnedItems.length > 0 && (
        <AccordionItem value="returnedItems" className="flex flex-col gap-1">
          <AccordionTrigger className="!border-0 px-2 focus:outline-none">
            <div>
              {t("Returned products")}: ({returnedItems.length})
            </div>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col">
            {returnedItems.map((item, i) => (
              <ItemLink item={item} key={i} />
            ))}
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}

function ItemLink({ item }: { item: items_from_loans }) {
  return (
    <Button
      asChild
      variant="link"
      className="h-auto items-start justify-start py-1"
      key={item.id}
    >
      <Link className="flex items-center gap-3" to={"/produkter/" + item.id}>
        <span>{item.Produkt}</span>
        {/* <i className="fa-solid fa-up-right-from-square cursor-pointer" /> */}
      </Link>
    </Button>
  );
}
