import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Table from "@/components/table";

import getData from "@/data/getData";
import { columnsFormatter } from "@/helpers/tableHelpers";

interface LayoutProps {
  table: string | DataWithHeaders<unknown> | null;
  exclude?: string[];
  noResultsText?: string;
  onRowClick?: (id: number) => void;
}

export default function Layout({
  table,
  exclude,
  noResultsText,
  onRowClick,
}: LayoutProps) {
  const navigate = useNavigate();

  const [inputData, setInputData] = useState<any>(table);

  async function fetchData() {
    if (typeof table === "string") {
      const data = await getData(table, { withHeaders: true });

      if (data) setInputData(data);
    }

    if (typeof table === "object") setInputData(table);
  }

  useEffect(() => {
    fetchData();
  }, [table]);

  function handleRowClick(id: number) {
    if (onRowClick) return onRowClick(id);

    navigate(id.toString());
  }

  if (!inputData) return <p>Loading data</p>;

  const columns = columnsFormatter<typeof inputData.data>(inputData.headers);

  if (!columns) return <p>Loading columns</p>;

  return (
    <div className="h-full w-full overflow-hidden p-4">
      <Table
        columns={columns}
        data={inputData.data}
        onRowClick={(original) => handleRowClick(original.id)}
        exclude={exclude}
        noResultsText={noResultsText}
      />
    </div>
  );
}
