import { useContext, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import useData from "@/hooks/useData";

import { CurrentUserContext } from "@/App";
import Layout from "@/layouts/index";

export default function LoansPage() {
  const { currentUser } = useContext(CurrentUserContext);
  if (!currentUser) return;
  const { id: id } = currentUser;

  const [onlyReturned, setOnlyReturned] = useState(false);

  const [loansView] = useData<loansView[]>("loans_view?user_id=" + id, {
    withHeaders: true,
  });

  function filterReturned(): DataWithHeaders<loansView[]> {
    if (!loansView)
      return [{ data: [], headers: [] }] as unknown as DataWithHeaders<
        loansView[]
      >;

    const filtered = loansView.data.filter((item) => item.Returneret);

    return {
      data: filtered,
      headers: loansView.headers,
    };
  }

  function filterNotReturned(): DataWithHeaders<loansView[]> {
    if (!loansView)
      return [{ data: [], headers: [] }] as unknown as DataWithHeaders<
        loansView[]
      >;

    const filtered = loansView.data.filter((item) => !item.Returneret);
    const newHeaders = loansView.headers.filter(
      (header) => header !== "Returneret",
    );

    return {
      data: filtered,
      headers: newHeaders,
    };
  }

  function handleChange() {
    setOnlyReturned((prev) => !prev);
  }

  // accordion with items in the loan

  return (
    <>
      <div className="absolute right-3 top-4 flex items-center gap-2">
        <Label htmlFor="toggleItems">Vis afleverede lån</Label>
        <Switch id="toggleItems" onCheckedChange={handleChange} />
      </div>
      <div className="h-full overflow-y-hidden pt-12">
        <Layout
          table={onlyReturned ? filterReturned() : filterNotReturned()}
          noResultsText="Ingen lån"
          onRowClick={() => {}}
          exclude={["Laaner", "Udlaaner", "user_id"]}
        />
      </div>
    </>
  );
}
