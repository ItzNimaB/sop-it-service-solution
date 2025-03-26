import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import getData from "@/data/getData";
import useBarcode from "@/hooks/useBarcode";
import useData from "@/hooks/useData";

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
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(initPage);

  const [user, setUser] = useState<usersView>();
  const [allUsers] = useData<usersView[]>("users_view", { withHeaders: true });
  const [products, setProducts] = useData<any>("available_products_view", {
    withHeaders: true,
  });
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
      toast.error(`${findProduct.Navn} er allerede tilføjet`);
      return;
    }

    findProduct = products?.data.find(
      ({ Stregkode }: any) => Stregkode == code,
    );

    if (findProduct) {
      toast.success(`${findProduct.Navn} tilføjet`);
      handleAddProduct(findProduct);
      return;
    }

    let getItemsFromLoans = await getData<any>(
      `items_from_loans?Stregkode=${code}&Returneret=null`,
      { withHeaders: false },
    );

    findProduct = getItemsFromLoans[0];

    if (findProduct) {
      toast.error(`${findProduct.Produkt_navn} er allerede lånt ud`);
      return;
    }

    toast.error("Produktet kunne ikke findes");
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
      const item = products?.data.find(({ UUID }: any) => UUID == initItem);

      if (item) {
        handleAddProduct(item);
        setSearchParams("");
      }
    }
  }, [products]);

  //checkout
  //--------------------------------------------------------------------------------
  async function createLoan(username: string, password: string) {
    if (!user) return toast.error("Vælg en bruger");

    let loan_length = null;

    if (returnDate) {
      loan_length = Math.round(
        (returnDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24),
      );
    }

    const loan = {
      user_id: user.UUID,
      loan_length,
      recipient_type_id: loanType,
      location_of_use_id: locationOfUse?.UUID,
    };

    const loanPromise = axios.post("loans", {
      loan,
      products: selectedProducts,
      personel_username: username,
      personel_password: password,
    });

    toast.promise(loanPromise, {
      loading: "Gemmer...",
      success: ({ data }: any) => {
        navigate(`/udlaan/${data.UUID}`);

        return "Gemt";
      },
      error: (err) => "Error 500 - " + err.response.data,
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
            users={allUsers?.data}
            headers={allUsers?.headers}
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
