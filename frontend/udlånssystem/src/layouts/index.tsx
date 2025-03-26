import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Table from "@/components/table";
import { Button } from "@/components/ui/button";

import getData from "@/data/getData";
import { columnsFormatter } from "@/helpers/tableHelpers";

interface LayoutProps {
  table: string | DataWithHeaders<unknown> | null;
  exclude?: string[];
  showNew?: boolean;
}

export default function Layout({
  table,
  exclude,
  showNew = true,
}: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [inputData, setInputData] = useState<any>(table);

  async function fetchData() {
    if (typeof table === "string") {
      const data = await getData(table, {
        withHeaders: true,
      });

      if (data) setInputData(data);
    }

    if (typeof table === "object") setInputData(table);
  }

  useEffect(() => {
    fetchData();
  }, [table]);

  function handleRowClick(id: number) {
    navigate(`${location.pathname}/${id}`);
  }

  if (!inputData) return <p>Loading data</p>;

  const columns = columnsFormatter<typeof inputData.data>(inputData.headers);

  if (!columns) return <p>Loading columns</p>;

  return (
    <div className="h-full w-full overflow-hidden p-4">
      {showNew && (
        <Button asChild>
          <Link
            to={`${location.pathname}/new`}
            className="absolute right-3 top-3 h-9"
          >
            New
          </Link>
        </Button>
      )}
      <Table
        columns={columns}
        data={inputData.data}
        onRowClick={(original) => handleRowClick(original.UUID)}
        exclude={exclude}
      />
    </div>
  );
}
