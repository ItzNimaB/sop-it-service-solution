import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import useData from "@/hooks/useData";

import Layout from "@/layouts/index";
import type { Item } from "@prisma";
import { getTableFields } from "./util";

export default function Index() {
  const { t } = useTranslation();

  const [showDeleted, setShowDeleted] = useState(false);

  const [items] = useData<Item[]>("items");

  function filterDeleted(): Item[] {
    if (!items) return [] as Item[];

    const filtered = items.filter(
      (item) =>
        !["Lånt ud", "Tilgængelig"].includes(item.product_status?.name || ""),
    );

    return filtered;
  }

  function filterNotDeleted(): Item[] {
    if (!items) return [] as Item[];

    const filtered = items.filter((item) =>
      ["Lånt ud", "Tilgængelig"].includes(item.product_status?.name || ""),
    );

    return filtered;
  }

    function getFilteredItems(showDeleted: boolean): Item[] {
      if (!items) return [] as Item[];
      return items.filter((item) =>
        showDeleted ? item.product_status_id : !item.product_status_id,
      );
    }

  function handleChange() {
    setShowDeleted((prev) => !prev);
  }

  return (
    <>
      <div className="absolute right-[5rem] top-4 flex items-center gap-2">
        <Label htmlFor="toggleItems">{t("Show deleted products")}</Label>
        <Switch id="toggleItems" onCheckedChange={handleChange} />
      </div>

      <Layout table={getFilteredItems(showDeleted)} fields={getTableFields()} />
    </>
  );
}
