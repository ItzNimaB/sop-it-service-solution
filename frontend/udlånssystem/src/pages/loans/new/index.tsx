import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import getData from "@/data/getData";
import useBarcode from "@/hooks/useBarcode";
import useData from "@/hooks/useData";

import type { loans } from "@prisma";
import axios from "axios";
import { toast } from "sonner";

import NewLoanInfo from "./components/Info";
import NewLoanNav from "./components/Nav";
import NewLoanProducts from "./components/Products";
import NewLoanReview from "./components/Review";
import UserSelect from "./components/UserSelect";

import "@/styles/newLoan.css";

export const loanTypes = [
  { name: "Til person", id: 2 },
  { name: "Til lokale", id: 1 },
];

const oneMonthFromNow = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate(),
);

export default function NewLoan({ initPage = 1 }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(initPage);

  const [user, setUser] = useState<usersView>();
  const [allUsers] = useData<usersView[]>("users_view", { withHeaders: true });
  const [products, setProducts] = useData<any>("available_products_view");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [returnDate, setReturnDate] = useState<Date | null>(oneMonthFromNow);
  const [loanType, setLoanType] = useState(2);
  const [building, setBuilding] = useState<buildingModel>();
  const [locationOfUse, setLocationOfUse] = useState<zoneModel>();

  useBarcode(handleBarcode);

  async function handleBarcode(code: string) {
    let findProduct = selectedProducts.find(
      ({ Stregkode }) => Stregkode == code,
    );

    if (findProduct) {
      toast.error(`${findProduct.Navn} ${t("already added")}`);
      return;
    }

    findProduct = products?.data.find(
      ({ Stregkode }: any) => Stregkode == code,
    );

    if (findProduct) {
      toast.success(`${findProduct.Navn} ${t("added")}`);
      handleAddProduct(findProduct);
      return;
    }

    let getItemsFromLoans = await getData<any>(
      `items_from_loans?Stregkode=${code}&Returneret=null`,
    );

    findProduct = getItemsFromLoans[0];

    if (findProduct) {
      toast.error(`${findProduct.Produkt_navn} ${t("already loaned")}`);
      return;
    }

    toast.error(t("Product not found"));
  }

  //Users
  //--------------------------------------------------------------------------------
  function handleUserSelection(selectedUser: any) {
    setUser(selectedUser);
    setPage((prev) => prev + 1);
  }

  //Products
  //--------------------------------------------------------------------------------

  function handleAddProduct(product: productModel) {
    if (!products || products?.data.length == 0) return;

    let tempProducts = [...products.data];
    let tempSelectedProducts = [...selectedProducts];

    const productIndex = tempProducts.indexOf(product);

    tempSelectedProducts.push(tempProducts.splice(productIndex, 1)[0] as any);

    setSelectedProducts(tempSelectedProducts);
    setProducts((prev: any) => {
      prev.data = tempProducts;
      return prev;
    });
  }

  function handleRemoveProduct(product: any) {
    if (!products || products?.data.length == 0) return;

    let tempProducts = [...products.data];
    let tempSelectedProducts = [...selectedProducts];

    const productIndex = tempSelectedProducts.indexOf(product);

    tempProducts.push(tempSelectedProducts.splice(productIndex, 1)[0] as any);

    setSelectedProducts(tempSelectedProducts);
    setProducts((prev: any) => {
      prev.data = tempProducts;
      return prev;
    });
  }

  //info
  //--------------------------------------------------------------------------------

  useEffect(() => {
    const initItem = searchParams.get("item");

    if (initItem) {
      const item = products?.data.find(({ id }: any) => id == initItem);

      if (item) {
        handleAddProduct(item);
        setSearchParams("");
      }
    }
  }, [products]);

  //checkout
  //--------------------------------------------------------------------------------
  async function createLoan(username: string, password: string) {
    if (!user) return toast.error(t("Choose an user"));

    let loan_length = null;

    if (returnDate) {
      loan_length = Math.round(
        (returnDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24),
      );
    }

    const loan = {
      user_id: user.id,
      loan_length,
      recipient_type_id: loanType,
      location_of_use_id: locationOfUse?.id,
    };

    const loanPromise = axios.post<loans>("loans", {
      loan,
      products: selectedProducts,
      personel_username: username,
      personel_password: password,
    });

    toast.promise(loanPromise, {
      loading: t("Saving") + "...",
      success: ({ data }) => {
        navigate(`/udlaan/${data.id}`);

        return t("Saved!");
      },
      error: (err) => err.response.data,
    });
  }

  return (
    <div className="content newLoan">
      <NewLoanNav
        setPage={setPage}
        page={page}
        products={selectedProducts}
        user={user}
        returnDate={returnDate}
        loanType={loanType}
      />

      <div className="main-content p-2">
        {page === 1 && (
          <UserSelect
            users={allUsers}
            handleUserSelection={handleUserSelection}
          />
        )}

        {page === 2 && (
          <NewLoanProducts
            products={products?.data}
            selectedProducts={selectedProducts}
            headers={products?.headers}
            handleaddProduct={handleAddProduct}
            handleRemoveProduct={handleRemoveProduct}
          />
        )}

        {page === 3 && (
          <NewLoanInfo
            selectedProducts={selectedProducts}
            setReturnDate={setReturnDate}
            returnDate={returnDate}
            setLoanType={setLoanType}
            building={building}
            setBuilding={setBuilding}
            locationOfUse={locationOfUse}
            setLocationOfUse={setLocationOfUse}
          />
        )}

        {page === 4 && (
          <NewLoanReview
            user={user}
            products={selectedProducts}
            headers={products?.headers}
            returnDate={returnDate}
            loanType={loanType}
            locationOfUse={locationOfUse}
            createLoan={createLoan}
          />
        )}
      </div>
    </div>
  );
}
