"use client";

import React, { useMemo } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  X,
} from "lucide-react";

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
  const [columnFiltersState, setColumnFiltersState] =
    React.useState<ColumnFiltersState>([]);

  // Memoize table configuration to prevent unnecessary recalculations
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
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

  // Memoize filter handlers to prevent unnecessary re-renders
  const handleResetFilters = React.useCallback(() => {
    setColumnFiltersState([]);
  }, []);

  const hasActiveFilters = columnFiltersState.length > 0;

  return (
    <div className="space-y-4">
      {/* Filters Section - Mobile Responsive */}
      {(searchKey || columnFilters.length > 0) && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center space-x-2 font-buenard text-lg">
                <Filter className="w-5 h-5 flex-shrink-0" />
                <span>Filters</span>
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-sm font-inknut w-full sm:w-auto"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Mobile-first responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search Input */}
              {searchKey && (
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <label className="text-sm font-medium text-platinum-800 font-inknut">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={
                        (table
                          .getColumn(searchKey)
                          ?.getFilterValue() as string) ?? ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn(searchKey)
                          ?.setFilterValue(event.target.value)
                      }
                      className="pl-10 font-forum h-10 w-full"
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
                      value={
                        (table
                          .getColumn(filter.columnId)
                          ?.getFilterValue() as string) ?? "all"
                      }
                      onValueChange={(value) =>
                        table
                          .getColumn(filter.columnId)
                          ?.setFilterValue(value === "all" ? "" : value)
                      }
                    >
                      <SelectTrigger className="font-forum w-full">
                        <SelectValue
                          placeholder={
                            filter.placeholder ||
                            `All ${filter.label.toLowerCase()}`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All {filter.label.toLowerCase()}
                        </SelectItem>
                        {filter.options.map((option, index) => (
                          <SelectItem
                            key={`${filter.columnId}-${option.value}-${index}`}
                            value={option.value}
                          >
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

      {/* Table - Mobile Responsive */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        {title && (
          <CardHeader className="pb-3">
            <CardTitle className="font-buenard text-lg sm:text-xl">
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="px-3 sm:px-6">
          {/* Mobile: Horizontal scroll container */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <div className="rounded-md border-0">
                <Table className="min-w-full">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="font-inknut text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                          >
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
                            <TableCell
                              key={cell.id}
                              className="font-forum text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center font-forum text-gray-500 text-sm"
                        >
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Pagination - Fully Responsive with Theme Colors */}
          <div className="mt-4 space-y-3 sm:space-y-0">
            {/* Mobile-first pagination layout */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              {/* Results info - Responsive text */}
              <div className="text-xs text-muted-foreground font-forum text-center sm:text-left">
                <span className="hidden md:inline">
                  Showing{" "}
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}{" "}
                  of {table.getFilteredRowModel().rows.length} entries
                </span>
                <span className="md:hidden">
                  {table.getFilteredRowModel().rows.length} total
                </span>
              </div>

              {/* Pagination controls - Mobile optimized */}
              <div className="flex items-center justify-center">
                <div className="flex items-center bg-muted rounded-lg p-1 space-x-1">
                  {/* First page - Only on larger screens */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="h-7 w-7 p-0 hidden lg:flex hover:bg-background hover:text-black"
                    title="First page"
                  >
                    <ChevronsLeft className="h-3 w-" />
                  </Button>

                  {/* Previous page */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="h-7 w-7 p-0 hover:bg-background hover:text-black"
                    title="Previous page"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>

                  {/* Page numbers - Smart display */}
                  <div className="flex items-center space-x-1">
                    {/* Mobile: Simple current/total */}
                    <div className="sm:hidden">
                      <span className="px-2 py-1 text-xs font-medium bg-background rounded border border-border">
                        {table.getState().pagination.pageIndex + 1}/
                        {table.getPageCount()}
                      </span>
                    </div>

                    {/* Desktop: Page numbers */}
                    <div className="hidden sm:flex items-center space-x-1">
                      {(() => {
                        const currentPage =
                          table.getState().pagination.pageIndex + 1;
                        const totalPages = table.getPageCount();
                        const pages = [];

                        // Always show first page
                        if (totalPages > 0) {
                          pages.push(1);
                        }

                        // Show pages around current page
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);

                        // Add ellipsis if needed
                        if (start > 2) {
                          pages.push("...");
                        }

                        // Add middle pages
                        for (let i = start; i <= end; i++) {
                          if (i !== 1 && i !== totalPages) {
                            pages.push(i);
                          }
                        }

                        // Add ellipsis if needed
                        if (end < totalPages - 1) {
                          pages.push("...");
                        }

                        // Always show last page
                        if (totalPages > 1) {
                          pages.push(totalPages);
                        }

                        return pages.map((page, index) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-1 text-muted-foreground"
                              >
                                ...
                              </span>
                            );
                          }

                          const isActive = page === currentPage;
                          return (
                            <Button
                              key={page}
                              variant={isActive ? "default" : "ghost"}
                              size="sm"
                              onClick={() =>
                                table.setPageIndex((page as number) - 1)
                              }
                              className={`h-7 w-7 p-0 text-xs ${
                                isActive
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "hover:bg-background hover:text-black"
                              }`}
                            >
                              {page}
                            </Button>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Next page */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="h-7 w-7 p-0 hover:bg-background hover:text-black"
                    title="Next page"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>

                  {/* Last page - Only on larger screens */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="h-7 w-7 p-0 hidden lg:flex hover:bg-background hover:text-black"
                    title="Last page"
                  >
                    <ChevronsRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile: Additional page info */}
            <div className="sm:hidden text-center">
              <span className="text-xs text-muted-foreground font-forum">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
