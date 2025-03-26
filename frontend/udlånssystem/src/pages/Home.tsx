import { useState } from "react";
import { useNavigate } from "react-router-dom";

import getData from "@/data/getData";
import useBarcode from "@/hooks/useBarcode";
import { cheatCode } from "@/services/cheatCode";

import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();

  useBarcode(handleBarcodeScan);

  const [cheatActive, setCheatActive] = useState(false);
  window.addEventListener(
    "cheatCode",
    (e) => {
      if (!cheatActive) setCheatActive(true);
    },
    { once: true },
  );
  cheatCode();

  async function handleBarcodeScan(value: string) {
    if (!value) return;

    const [scannedProduct] =
      (await getData<itemsView[]>("items_view?Stregkode=" + value)) || [];

    if (!scannedProduct) return toast.warning("Produktet kunne ikke findes");

    if (scannedProduct.Status == "Available") {
      navigate(`/udlaan/new?item=${scannedProduct.UUID}`);
      return;
    }

    if (scannedProduct.Status == "Lent") {
      const item_from_loan = await getData<itemsFromLoan[]>(
        `items_from_loans?UUID=${scannedProduct.UUID}&Returneret=null`,
      );

      if (!item_from_loan?.length) {
        toast.error(
          "Produktet er lånt ud, men kunne ikke findes på et aktivt lån",
        );
        return;
      }

      return navigate(
        `/udlaan/${item_from_loan[0].loan_id}/returner?item=${scannedProduct.UUID}`,
      );
    }

    navigate(`/produkter/${scannedProduct.UUID}`);
  }

  if (cheatActive)
    return (
      <div className="flex items-center justify-center">
        <img src="/nyanCat.gif" className="w-full" alt="nyan cat" />
      </div>
    );

  return (
    <div className="flex max-h-screen flex-col items-center gap-2 pt-16">
      <h1 className="text-[3rem]">Velkommen til helpdesk'en</h1>
      <p className="text-foreground2 text-[1.2rem]">
        Hvordan kan vi hjælpe dig i dag?
      </p>
      <img
        className="h-full w-3/5 object-cover"
        src="svg/welcome.svg"
        alt="Welcome"
      />
    </div>
  );
}
