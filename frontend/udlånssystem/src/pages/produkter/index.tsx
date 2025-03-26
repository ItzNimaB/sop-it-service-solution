import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import useData from "@/hooks/useData";

import Layout from "@/layouts/index";

export default function Index() {
  const [showDeleted, setShowDeleted] = useState(false);

  const [itemsView] = useData<itemsView[]>("items_view", {
    withHeaders: true,
  });

  function filterDeleted(): DataWithHeaders<itemsView[]> {
    if (!itemsView)
      return [{ data: [], headers: [] }] as unknown as DataWithHeaders<
        itemsView[]
      >;

    const filtered = itemsView.data.filter(
      (item) => !["Lånt ud", "Tilgængelig"].includes(item.Status),
    );

    return {
      data: filtered,
      headers: itemsView.headers,
    };
  }

  function filterNotDeleted(): DataWithHeaders<itemsView[]> {
    if (!itemsView)
      return [{ data: [], headers: [] }] as unknown as DataWithHeaders<
        itemsView[]
      >;

    const filtered = itemsView.data.filter((item) =>
      ["Lånt ud", "Tilgængelig"].includes(item.Status),
    );

    return {
      data: filtered,
      headers: itemsView.headers,
    };
  }

  function handleChange() {
    setShowDeleted((prev) => !prev);
  }

  return (
    <>
      <div className="absolute right-[5rem] top-4 flex items-center gap-2">
        <Label htmlFor="toggleItems">Vis slettede produkter</Label>
        <Switch id="toggleItems" onCheckedChange={handleChange} />
      </div>

      <Layout table={showDeleted ? filterDeleted() : filterNotDeleted()} />
    </>
  );
}
