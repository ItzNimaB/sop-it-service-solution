import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Table, { type ExcludeList } from "@/components/table";

import getData from "@/data/getData";
import { columnsFormatter } from "@/helpers/tableHelpers";
import useBarcode from "@/hooks/useBarcode";
import useData from "@/hooks/useData";

import axios from "axios";
import { toast } from "sonner";

import "@/styles/return.css";

const exclude: ExcludeList<itemsFromLoan> = [
  "loan_id",
  "Stregkode",
  "Returneret",
  "Med_taske",
  "Med_Laas",
];

export default function Return() {
  const { id } = useParams();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [itemsLent, setItemsLent] = useState<itemsFromLoan[]>([]);
  const [itemsReturning, setItemsReturning] = useState<itemsFromLoan[]>([]);
  const [itemsReturned, setItemsReturned] = useState<itemsFromLoan[]>([]);

  const [products] = useData<itemsFromLoan[]>("items_from_loans");

  useEffect(() => {
    const initItem = searchParams.get("item");

    if (initItem) {
      const item = products?.find(({ id }) => id.toString() == initItem);

      if (item) {
        handleAddProduct(item);
        setSearchParams("");
      }
    }
  }, [products]);

  useBarcode(handleBarcode);

  async function handleBarcode(code: string) {
    let findProduct = itemsReturning.find(({ Stregkode }) => Stregkode == code);

    if (findProduct) {
      toast.error(`${findProduct.Produkt} ${t("already added")}`);
      return;
    }

    findProduct = itemsLent.find(({ Stregkode }) => Stregkode == code);

    if (findProduct) {
      toast.success(`${findProduct.Produkt} ${t("added")}`);
      handleAddProduct(findProduct);
      return;
    }

    let getItemsFromLoans = await getData<any>(
      `items_from_loans?Stregkode=${code}&Returneret=null`,
    );

    findProduct = getItemsFromLoans[0];

    if (findProduct) {
      toast.error(t("already loaned", findProduct.Product));
      return;
    }

    toast.error(t("Product not found"));
  }

  async function importDataFromDB() {
    const items = await getData<itemsFromLoan[]>(
      "items_from_loans?loan_id=" + id,
    );

    if (!items) return;

    setItemsLent(items.filter((item) => !item.Returneret));
    setItemsReturned(items.filter((item) => item.Returneret));
  }

  function handleAddProduct(product: itemsFromLoan) {
    if (itemsLent.length == 0) return;

    const tempReturn = [...itemsReturning];
    const tempLent = [...itemsLent];

    const productIndex = tempLent.findIndex(({ id }) => id == product.id);

    if (productIndex == -1) return;

    tempReturn.push(tempLent.splice(productIndex, 1)[0]);

    setItemsReturning(tempReturn);
    setItemsLent(tempLent);
  }

  function handleRemoveProduct(product: itemsFromLoan) {
    const tempReturn = [...itemsReturning];
    const tempLent = [...itemsLent];

    const productIndex = tempReturn.findIndex(({ id }) => id == product.id);

    tempLent.push(tempReturn.splice(productIndex, 1)[0]);

    setItemsReturning(tempReturn);
    setItemsLent(tempLent);
  }

  async function handleReturn() {
    if (itemsReturning.length > 0) {
      const updatePromise = axios.patch("loans/return/item", {
        ItemsInLoanToReturn: itemsReturning,
      });

      toast.promise(updatePromise, {
        loading: t("Return products") + "...",
        success: t("Products returned"),
        error: t("An error occurred"),
      });
    }

    navigate(`/udlaan`);
  }
  function handleAddAll() {
    setItemsReturning(itemsLent);
    setItemsLent([]);
  }

  useEffect(() => {
    importDataFromDB();
  }, []);

  const columns = columnsFormatter<itemsFromLoan>(
    Object.keys(itemsLent[0] || itemsReturning[0] || itemsReturned[0] || {}),
  );

  return (
    <div className="returnLoan relative max-h-full overflow-y-scroll pb-16">
      {(itemsReturning.length != 0 || itemsLent.length != 0) && (
        <div className="max-h-half relative mt-8 grid h-max grid-cols-2 gap-4 pt-16">
          <div className="seperation seperation-1 absolute left-1/2 h-full border-r-2" />
          <div className="col-start-1">
            {itemsLent?.length > 0 && (
              <Table
                data={itemsLent}
                columns={columns || []}
                exclude={exclude}
                onRowClick={handleAddProduct}
                withFilters={false}
              />
            )}
          </div>
          <div className="col-start-2">
            {itemsReturning?.length > 0 ? (
              <Table
                data={itemsReturning}
                columns={columns || []}
                exclude={exclude}
                onRowClick={handleRemoveProduct}
                withFilters={false}
              />
            ) : (
              <p className="text-center">{t("Click to choose products")}</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center justify-center gap-2">
        {(itemsLent.length != 0 || itemsReturning.length != 0) && (
          <>
            <button
              onClick={handleAddAll}
              id="add-all"
              disabled={itemsLent.length < 1}
            >
              {t("Add all products")}
            </button>
            <button
              onClick={handleReturn}
              id="return"
              disabled={!itemsReturning.length}
            >
              {t("Return products")}
            </button>
          </>
        )}

        <h1 className="mt-16 text-xl">{t("Returned products")}</h1>
        <hr className="w-full" />

        <Table
          data={itemsReturned}
          columns={columns || []}
          exclude={exclude}
          withFilters={false}
        />
      </div>
    </div>
  );
}
