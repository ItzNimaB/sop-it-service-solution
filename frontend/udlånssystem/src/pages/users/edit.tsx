import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import DataTable, { type ExcludeList } from "@/components/table";

import { columnsFormatter } from "@/helpers/tableHelpers";
import useData from "@/hooks/useData";

import type { users } from "@prisma";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [userLoans] = useData<users[]>("/user_loans?user_id=" + id);

  if (!userLoans) return <div>{t("Loading")}...</div>;

  const columns = columnsFormatter<userLoans>(userLoans.headers);

  const exclude: ExcludeList<userLoans> = ["id", "item_id", "user_id"];

  return (
    <div className="flex h-full gap-5 p-5">
      <div className="flex w-1/2 flex-col items-center gap-3">
        <h1 className="text-2xl font-extrabold">
          {t("Active products in loan")}
        </h1>
        <DataTable
          columns={columns}
          data={userLoans.filter((row) => !row.Returneret)}
          exclude={[...exclude, "Returneret"]}
          onRowClick={(row) => navigate(`/produkter/${row.item_id}`)}
        />
      </div>

      <div className="flex w-1/2 flex-col items-center gap-3">
        <h1 className="text-2xl font-extrabold">{t("Returned products")}</h1>
        <DataTable
          columns={columns}
          data={userLoans.filter((row) => row.Returneret)}
          exclude={[...exclude, "Returneringsdato"]}
          onRowClick={(row) => navigate(`/produkter/${row.item_id}`)}
        />
      </div>
    </div>
  );
}
