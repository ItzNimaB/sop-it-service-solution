import { useNavigate, useParams } from "react-router-dom";

import DataTable, { type ExcludeList } from "@components/table";

import { columnsFormatter } from "@helpers/tableHelpers";
import useData from "@hooks/useData";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userLoans] = useData<userLoans[]>("/user_loans?user_id=" + id, {
    withHeaders: true,
  });

  if (!userLoans?.data) return <div>Loading...</div>;

  const columns = columnsFormatter<userLoans>(userLoans.headers);

  const exclude: ExcludeList<userLoans> = ["UUID", "item_id", "user_id"];

  return (
    <div className="flex h-full gap-5 p-5">
      <div className="flex w-1/2 flex-col gap-3">
        <h1 className="text-lg font-semibold">Aktive produkter i lån</h1>
        <DataTable
          columns={columns}
          data={userLoans.data.filter((row) => !row.Returneret)}
          exclude={[...exclude, "Returneret"]}
          onRowClick={(row) => navigate(`/produkter/${row.item_id}`)}
        />
      </div>

      <div className="flex w-1/2 flex-col gap-3">
        <h1 className="text-lg font-semibold">Returnerede produkter</h1>
        <DataTable
          columns={columns}
          data={userLoans.data.filter((row) => row.Returneret)}
          exclude={[...exclude, "Returneringsdato"]}
          onRowClick={(row) => navigate(`/produkter/${row.item_id}`)}
        />
      </div>
    </div>
  );
}
