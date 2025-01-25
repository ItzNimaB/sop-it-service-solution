import { useState } from "react";

import { Button } from "@components/ui/button";

import { getLongestWordLength } from "@helpers/tableHelpers";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  type Header,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Filter from "./tableFilter";
import ToolTip from "./tooltip";
import { Slider } from "./ui/slider";

import "@styles/table.css";
import "@styles/tablePagination.css";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  exclude?: string[];
  onRowClick?: (row: TData) => void;
  pageSize?: number;
  withFilters?: boolean;
  withPagination?: boolean;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  exclude = [],
  onRowClick = () => {},
  pageSize = 20,
  withFilters = true,
  withPagination = true,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
    autoResetPageIndex: false,
  });

  function sortDir(header: Header<TData, unknown>) {
    const sort = header.column.getIsSorted();
    if (sort == "asc") return "down";
    if (sort == "desc") return "up";

    return "";
  }

  return (
    <div className="defaultTable flex h-full w-full flex-col">
      <div className="h-full w-full overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (exclude.includes(header.id)) return null;

                  return (
                    <TableHead key={header.id}>
                      <div
                        className="flex cursor-pointer select-none items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {header.column.getIsSorted() && (
                          <i
                            className={`fa-solid fa-arrow-${sortDir(header)}`}
                          />
                        )}
                      </div>

                      {withFilters && (
                        <Filter column={header.column} table={table} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  onClick={() => {
                    onRowClick(row.original);
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (exclude.includes(cell.column.id)) return null;

                    return (
                      <TableCell key={cell.id} className={cell.column.id}>
                        <ToolTip
                          display={cell.getValue() as string}
                          className="mx-2 flex h-full w-full py-[0.35rem]"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </ToolTip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {withPagination && (
        <div className="mt-auto flex flex-col items-center justify-center gap-4 py-3">
          <div className="pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fa-solid fa-angles-left"></i>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fa-solid fa-angle-left" />
            </Button>

            <div>
              {pagination.pageIndex + 1} af {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <i className="fa-solid fa-angle-right" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <i className="fa-solid fa-angles-right"></i>
            </Button>
          </div>
          <Slider
            max={table.getPageCount() - 1}
            onValueChange={([value]) => {
              table.setPageIndex(value);
            }}
            value={[pagination.pageIndex]}
            className="w-5/6"
          />
        </div>
      )}
    </div>
  );
}
