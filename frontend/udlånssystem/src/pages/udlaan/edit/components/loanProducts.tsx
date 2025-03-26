import { Link, useParams } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import useData from "@/hooks/useData";

export default function LoanProducts() {
  const { id } = useParams() as any;

  const [itemsFromLoans] = useData<itemsFromLoan[]>(
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
            Lånte produkter: ({activeItems.length})
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
            <div>Returnerede produkter: ({returnedItems.length})</div>
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

function ItemLink({ item }: { item: itemsFromLoan }) {
  return (
    <Button
      asChild
      variant="link"
      className="h-auto items-start justify-start py-1"
      key={item.UUID}
    >
      <Link className="flex items-center gap-3" to={"/produkter/" + item.UUID}>
        <span>{item.Produkt}</span>
        {/* <i className="fa-solid fa-up-right-from-square cursor-pointer" /> */}
      </Link>
    </Button>
  );
}
