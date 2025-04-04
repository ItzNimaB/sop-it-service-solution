import { useSearchParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import type { Column, Table } from "@tanstack/react-table";

export default function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const [_, setSearchParams] = useSearchParams();

  const columnFilterValue = column.getFilterValue();

  return (
    <Input
      className="my-2 h-fit rounded border py-1 shadow"
      onChange={(e) => {
        const { value } = e.target;

        column.setFilterValue(value);

        setSearchParams(
          (prev) => {
            const paramsObject = Object.fromEntries(prev.entries());

            if (value === "") {
              delete paramsObject[column.id];

              return paramsObject;
            }

            return { ...paramsObject, [column.id]: value.trim() };
          },
          { replace: true },
        );
      }}
      onClick={(e) => e.stopPropagation()}
      placeholder="Søg..."
      type="text"
      value={(columnFilterValue ?? "") as string}
      disabled={!column.getCanFilter()}
    />
  );
}
