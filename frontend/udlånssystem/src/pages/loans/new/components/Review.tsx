import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import Table from "@/components/table";
import TextQuestion from "@/components/text-question";

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
  const { t } = useTranslation();

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
            <li>
              {t("Users")}: {user?.Navn || user?.Brugernavn}
            </li>
            <li>
              {t("Products")}: {products.length}
            </li>
            {returnDate ? (
              <li>
                {t("Return date")}: {returnDate.getFullYear()}{" "}
                {translateMonth[returnDate.getMonth()]} {returnDate.getDate()}
              </li>
            ) : (
              <li>
                {t("Return date")}: {t("None")}
              </li>
            )}
            <li>
              {t("Recipient type")}:{" "}
              {loanTypes.find(({ id }) => id === loanType)!.name ??
                t("Not defined")}
            </li>
            <li>
              {t("Location")}: {locationOfUse?.name || t("None")}
            </li>
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
          {t("Create")}
        </button>
      </div>
    </div>
  );
}
