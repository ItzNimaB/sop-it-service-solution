import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import getData from "@/data/getData";
import useBarcode from "@/hooks/useBarcode";
import { cheatCode } from "@/services/cheatCode";

import { toast } from "sonner";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useBarcode(handleBarcodeScan);

  const [cheatActive, setCheatActive] = useState(false);
  window.addEventListener(
    "cheatCode",
    () => {
      if (!cheatActive) setCheatActive(true);
    },
    { once: true },
  );
  cheatCode();

  async function handleBarcodeScan(value: string) {
    if (!value) return;

    const [scannedProduct] =
      (await getData<itemsView[]>("items_view?Stregkode=" + value)) || [];

    if (!scannedProduct) return toast.warning(t("Product not found"));

    if (scannedProduct.Status == "Available") {
      navigate(`/udlaan/new?item=${scannedProduct.id}`);
      return;
    }

    if (scannedProduct.Status == "Lent") {
      const item_from_loan = await getData<itemsFromLoan[]>(
        `items_from_loans?id=${scannedProduct.id}&Returneret=null`,
      );

      if (!item_from_loan?.length) {
        toast.error(
          t("Product is lent out, but could not be found on an active loan"),
        );
        return;
      }

      return navigate(
        `/udlaan/${item_from_loan[0].loan_id}/returner?item=${scannedProduct.id}`,
      );
    }

    navigate(`/products/${scannedProduct.id}`);
  }

  if (cheatActive) {
    return (
      <div className="flex items-center justify-center">
        <img src="/nyanCat.gif" className="w-full" alt="nyan cat" />
      </div>
    );
  }

  return (
    <div className="flex max-h-screen flex-col items-center gap-2 pt-16">
      <h1 className="text-5xl">{t("Welcome to the helpdesk")}</h1>
      <p className="text-foreground2 text-[1.2rem]">
        {t("Scan a product to get started")}
      </p>
      <img
        className="h-full w-3/5 object-cover"
        src="svg/welcome.svg"
        alt="Welcome"
      />
    </div>
  );
}
