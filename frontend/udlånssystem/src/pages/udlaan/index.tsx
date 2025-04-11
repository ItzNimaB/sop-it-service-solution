import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import useData from "@/hooks/useData";

import Layout from "@/layouts/index";

export default function Index() {
  const [onlyReturned, setOnlyReturned] = useState(false);

  const [loansView] = useData<loansView[]>("loans_view", {
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

  return (
    <>
      <div className="absolute right-[5rem] top-4 flex items-center gap-2">
        <Label htmlFor="toggleItems">Vis afleverede lån</Label>
        <Switch id="toggleItems" onCheckedChange={handleChange} />
      </div>
      <Layout
        table={onlyReturned ? filterReturned() : filterNotReturned()}
        exclude={["user_id"]}
      />
    </>
  );
}
