import { useContext, useState } from "react";

import Table from "@/components/table";
import TextQuestion from "@/components/textQuestion";

import { columnsFormatter } from "@/helpers/tableHelpers";
import translateMonth from "@/services/translateMonth.json";

import { CurrentUserContext } from "@/App";

import { loanTypes } from "..";

interface NewLoanReviewProps {
  user?: usersView;
  products: productModel[];
  headers?: string[];
  returnDate: Date | null;
  loanType: number;
  locationOfUse: zoneModel | undefined;
  createLoan: (username: string, password: string) => void;
}

export default function NewLoanReview({
  user,
  products,
  headers,
  returnDate,
  loanType,
  locationOfUse,
  createLoan,
}: NewLoanReviewProps) {
  const { currentUser } = useContext(CurrentUserContext);

  const [username, setUsername] = useState(currentUser?.username || "");
  const [password, setPassword] = useState("");

  const columns = columnsFormatter<productModel>(headers);
  if (!columns) return null;

  return (
    <div className="wrapper">
      <div className="chechout-container">
        <div className="info-container">
          <ul>
            <li>Bruger: {user?.Navn || user?.Brugernavn}</li>
            <li>Produkter: {products.length}</li>
            {returnDate ? (
              <li>
                Retur dato: {returnDate.getFullYear()}{" "}
                {translateMonth[returnDate.getMonth()]} {returnDate.getDate()}
              </li>
            ) : (
              <li>Retur dato: Ingen</li>
            )}
            <li>
              Låner type:{" "}
              {loanTypes.find(({ id }) => id === loanType)!.name ?? "Ikke sat"}
            </li>
            <li>Lokalitet: {locationOfUse?.name || "Ingen"}</li>
          </ul>
        </div>
        {products.length > 0 && (
          <div className="table-container">
            <Table
              data={products}
              columns={columns}
              withFilters={false}
              withPagination={false}
            />
          </div>
        )}
      </div>
      <div className="button-container">
        <form
          id="create-loan"
          onSubmit={(e) => {
            e.preventDefault();
            createLoan(username, password);
          }}
        >
          <TextQuestion
            label="Skriv dit uni-login"
            value={username}
            setValue={setUsername}
          />
          <TextQuestion
            label="Skriv adgangskoden til dit uni-login"
            type="password"
            value={password}
            setValue={setPassword}
          />
        </form>
        <button
          className="create-btn"
          form="create-loan"
          type="submit"
          // disabled={!validateInfo || !validateProducts || !validateUser}
        >
          Opret
        </button>
      </div>
    </div>
  );
}
