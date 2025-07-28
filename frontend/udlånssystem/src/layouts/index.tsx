import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Table from "@/components/table";
import { Button } from "@/components/ui/button";

import getData from "@/data/getData";
import { columnsFormatter } from "@/helpers/tableHelpers";

import { getDefaultTableFields } from "./util";

interface LayoutProps {
  table: string | object | null;
  exclude?: string[];
  showNew?: boolean;
  fields?: Field[];
}

export default function Layout({
  table,
  exclude,
  showNew = true,
  fields = getDefaultTableFields(),
}: LayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [inputData, setInputData] = useState<any>(table);

  async function fetchData() {
    if (typeof table === "object") return setInputData(table);

    if (typeof table === "string") {
      const data = await getData(table);

      if (data) setInputData(data);
    }
  }

  useEffect(() => {
    fetchData();
  }, [table]);

  function handleRowClick(id: number) {
    navigate(`${location.pathname}/${id}`);
  }

  if (!inputData) return <p>{t("No data found")}</p>;

  const columns = columnsFormatter(fields);

  if (!columns) return <p>{t("No columns found")}</p>;

  return (
    <div className="h-full w-full overflow-hidden p-4">
      {showNew && (
        <Button asChild>
          <Link
            to={`${location.pathname}/new`}
            className="absolute right-3 top-3 h-9"
          >
            {t("New")}
          </Link>
        </Button>
      )}
      <Table
        columns={columns}
        data={inputData}
        onRowClick={({ id }) => handleRowClick(id)}
        exclude={exclude as any[]}
      />
    </div>
  );
}
