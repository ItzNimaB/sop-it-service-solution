import { useContext } from "react";

import { CurrentUserContext } from "@/App";
import Layout from "@/layouts";

export default function LoanedProducts() {
  const { currentUser: user } = useContext(CurrentUserContext);

  return (
    <Layout
      table={`user_loans?user_id=${user?.UUID}`}
      exclude={["item_id", "user_id"]}
      noResultsText="Ingen lånte produkter"
      onRowClick={() => {}}
    />
  );
}
