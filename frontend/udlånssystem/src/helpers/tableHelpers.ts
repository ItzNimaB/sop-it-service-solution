import type { ColumnDef } from "@tanstack/react-table";

import { dateToReadable } from "./dateHelpers";

export const dateColumns = [
  "Oprettet",
  "Opdateret",
  "Returneret",
  "Returneringsdato",
];

function EnableFilter(header: string) {
  if (dateColumns.includes(header)) return false;

  return true;
}

export function columnsFormatter<T>(headers: string[]): ColumnDef<T, any>[]
export function columnsFormatter<T>(headers?: string[]): ColumnDef<T, any>[] | undefined

export function columnsFormatter<T>(headers?: string[]) {
  if (!headers) return;

  const columns: ColumnDef<T, any>[] = headers.map((header) => ({
    header: header.replaceAll("_", " "),
    accessorKey: String(header),
    enableColumnFilter: EnableFilter(header),
    filterFn: (rows, id, filterValue) => {
      const filterKey = (rows.original as Record<string, any>)[id];

      if (String(filterKey).toLowerCase().includes(filterValue.toLowerCase())) {
        return true;
      }

      return false;
    },
    cell: (row) => {
      if (dateColumns.includes(header)) return dateToReadable(row.getValue());

      return row.getValue();
    },
  }));

  return columns;
}

export function getLongestWordLength(words: string[]) {
  return words.reduce((longest, word) => {
    return word.length > longest ? word.length : longest;
  }, 0);
}
