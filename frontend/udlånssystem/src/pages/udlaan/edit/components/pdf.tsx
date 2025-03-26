import { forwardRef, useEffect, useState } from "react";

import getData from "@/data/getData";

import "@styles/pdf.css";

interface LoansPdfProps {
  loan: loanModel;
}

export default forwardRef<HTMLDivElement, LoansPdfProps>(({ loan }, ref) => {
  const [itemsInLoan, setItemsInLoan] = useState<itemsFromLoan[]>([]);
  const [loaner, setLoaner] = useState<userModel | null>();
  const [helpdesk_personel, setHelpdesk_personel] =
    useState<userModel | null>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loan) return;

    fetchData();
  }, [loan]);

  async function fetchData() {
    if (!loan) return;

    const itemsInLoanTemp = await getData<itemsFromLoan[]>(
      "items_from_loans?loan_id=" + loan.UUID,
    );

    const loanerTemp = await getData<userModel>("users", {
      UUID: loan.user_id,
    });

    const helpdesk_personelTemp = await getData<userModel>("users", {
      UUID: loan.helpdesk_personel_id,
    });

    setItemsInLoan(itemsInLoanTemp ?? []);
    setLoaner(loanerTemp);
    setHelpdesk_personel(helpdesk_personelTemp);

    setLoading(false);
  }

  if (loading || !loan || !loaner || helpdesk_personel === undefined) {
    return <div>Loading...</div>;
  }

  let date_to_be_returned =
    new Date(loan.date_created).getTime() +
    loan.loan_length * 24 * 60 * 60 * 1000;

  return (
    <div id="pdf" className="px-10" ref={ref}>
      <section>
        <div className="flex w-full justify-around p-6 pt-8">
          <img src="/sde-logotype.png" alt="SDE logo" />
          <img src="/logo.png" alt="Logo" className="scale-75" />
        </div>

        <h1 className="text-center text-2xl font-bold">Udlånskvittering</h1>
      </section>

      <div className="line" />

      <section className="grid grid-cols-2 gap-y-3">
        <div>
          <span> Låner: </span>
          <h2>{loaner.username}</h2>
        </div>

        <div>
          <span> Udlåner: </span>
          <h2>{helpdesk_personel?.username || "Ingen"}</h2>
        </div>

        <div>
          <span> Udlånsdato: </span>
          <h2>{new Date(loan.date_created).toLocaleDateString("da-dk")}</h2>
        </div>

        <div>
          <span> Afleveringsdato: </span>
          <h2>
            {loan.loan_length ? (
              new Date(date_to_be_returned).toLocaleDateString("da-dk")
            ) : (
              <i className="fa-solid fa-infinity" />
            )}
          </h2>
        </div>
      </section>

      <div className="line" />

      <section className="flex">
        <div className="w-full">
          <h2 className="mb-2 font-semibold">Produkter:</h2>
          <div className="flex flex-col gap-4">
            {itemsInLoan.map((item, i) => (
              <div key={i} className="flex w-full justify-between">
                <h3>{item.Produkt}</h3>
                <div className="flex flex-col items-center text-nowrap">
                  <p className="!font-barcode -mt-4 text-4xl">
                    {item.Stregkode}
                  </p>
                  <p className="text-sm">{item.Stregkode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});
