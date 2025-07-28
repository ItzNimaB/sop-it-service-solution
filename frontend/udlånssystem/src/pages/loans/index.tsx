import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import useData from "@/hooks/useData";

import Layout from "@/layouts/index";
import type { Loan } from "@prisma";

export default function Index() {
  const { t } = useTranslation();

  const [onlyReturned, setOnlyReturned] = useState(false);

  const [loans] = useData<Loan[]>("loans");

  function getFilteredLoans(showReturned: boolean): Loan[] {
    if (!loans) return [] as Loan[];
    return loans.filter((item) =>
      showReturned ? item.date_of_return : !item.date_of_return,
    );
  }

  function handleChange() {
    setOnlyReturned((prev) => !prev);
  }

  return (
    <>
      <div className="absolute right-[5rem] top-4 flex items-center gap-2">
        <Label htmlFor="toggleItems">{t("Show returned loans")}</Label>
        <Switch id="toggleItems" onCheckedChange={handleChange} />
      </div>
      <Layout table={getFilteredLoans(onlyReturned)} exclude={["user_id"]} />
    </>
  );
}
