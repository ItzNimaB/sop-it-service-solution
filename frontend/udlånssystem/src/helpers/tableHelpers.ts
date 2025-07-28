import type { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";

const defaultFields = [
  { label: "id", binding: "id" },
  { label: t("Name"), binding: "name" },
];

export function columnsFormatter<T extends { id: number }>(
  fields: TableField[] = defaultFields,
): ColumnDef<T>[] {
  const columns: ColumnDef<T, any>[] = fields.map((field) => ({
    header: field.label,
    accessorKey: field.binding,
    enableColumnFilter: field.enableFilter ?? true,
    filterFn: (rows, id, filterValue) => {
      const filterKey = (rows.original as Record<string, any>)[id];

      if (String(filterKey).toLowerCase().includes(filterValue.toLowerCase())) {
        return true;
      }

      return false;
    },
    cell: ({ getValue }) => {
      const value = getValue();

      if (field.formatter) return field.formatter(value);

      return value;
    },
  }));

  return columns;
}
