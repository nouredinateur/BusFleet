"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface ColumnFilter {
  columnId: string;
  label: string;
  type: "select" | "range";
  options?: FilterOption[];
  placeholder?: string;
}

interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  columnFilters?: ColumnFilter[];
  title?: string;
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  columnFilters = [],
  title,
}: EnhancedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFiltersState, setColumnFiltersState] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFiltersState,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters: columnFiltersState,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleResetFilters = () => {
    setColumnFiltersState([]);
  };

  const hasActiveFilters = columnFiltersState.length > 0;

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      {(searchKey || columnFilters.length > 0) && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 font-buenard">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-sm font-inknut"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              {searchKey && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-platinum-800 font-inknut">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                      onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                      }
                      className="pl-10 font-forum"
                    />
                  </div>
                </div>
              )}

              {/* Column Filters */}
              {columnFilters.map((filter) => (
                <div key={filter.columnId} className="space-y-2">
                  <label className="text-sm font-medium text-platinum-800 font-inknut">
                    {filter.label}
                  </label>
                  {filter.type === "select" && filter.options && (
                    <Select
                      value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? "all"}
                      onValueChange={(value) =>
                        table.getColumn(filter.columnId)?.setFilterValue(value === "all" ? "" : value)
                      }
                    >
                      <SelectTrigger className="font-forum">
                        <SelectValue placeholder={filter.placeholder || `All ${filter.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {filter.label.toLowerCase()}</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        {title && (
          <CardHeader>
            <CardTitle className="font-buenard">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="px-6">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-inknut">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="font-forum">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center font-forum text-gray-500">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-500 font-forum">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-forum">Page</span>
                <span className="text-sm font-semibold font-forum">
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}