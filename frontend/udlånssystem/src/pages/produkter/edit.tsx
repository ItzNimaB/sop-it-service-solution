import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { findActiveLoan } from "@/helpers/loanHelpers";
import useData from "@/hooks/useData";

import EditLayout from "@/layouts/edit";

import { LoanHistory, fields, zodSchema } from "./util";

import "@/styles/productsEdit.css";

interface itemModelWithItemsInLoan extends itemModel {
  items_in_loan: itemInLoanModel[];
}

export default function Edit() {
  const { id } = useParams();
  const [item] = useData<itemModelWithItemsInLoan>("items", undefined, id);
  const [itemInLoan] = useData<itemInLoanModel[]>(
    "items_in_loan?item_id=" + id,
    { withHeaders: false },
  );
  const [itemsInLoan, setItemsInLoan] = useState<itemInLoanModel[]>([]);

  useEffect(() => {
    if (item) setItemsInLoan(item.items_in_loan.reverse());
  }, [item]);

  if (!item) return null;

  const activeLoan = findActiveLoan(itemInLoan);

  return (
    <EditLayout
      table="items"
      fields={fields}
      zodSchema={zodSchema}
      panelSlot={
        <>
          <div className="flex flex-col items-center gap-3 overflow-y-scroll px-4">
            <h1>Lånehistorik:</h1>
            {itemsInLoan?.length > 0 ? (
              <ul className="loanHistoryList">
                {itemsInLoan.map((item: itemInLoanModel | any, i: number) => {
                  const loanHistory = new LoanHistory(item);
                  return (
                    <Link
                      key={i}
                      className={`${loanHistory.isActive()} loanHistoryItem`}
                      to={`/udlaan/${item.loan_id}`}
                    >
                      <p>{loanHistory.date()}</p>
                      <p>{loanHistory.time()}</p>
                      <p>{loanHistory.user()}</p>
                    </Link>
                  );
                })}
              </ul>
            ) : (
              <p>Ingen lånehistorik</p>
            )}
          </div>

          <Link
            className="border-foreground text-foreground mt-auto flex h-8 w-full min-w-8 items-center justify-center rounded-[10px] border-[1px] bg-none"
            to={
              activeLoan
                ? "/udlaan/" + activeLoan.loan_id
                : "/udlaan/new?item=" + id
            }
          >
            {activeLoan ? "Gå til lån" : "Opret lån"}
          </Link>
        </>
      }
      formSlot={
        <div className="flex w-full justify-center">
          <Button asChild variant="outline" size="default">
            <Link to={`/produkter/new/${id}`}>Kopier produkt</Link>
          </Button>
        </div>
      }
    ></EditLayout>
  );
}
