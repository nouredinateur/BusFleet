"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Route } from "../types";

interface RoutesColumnsProps {
  onEditRoute: (route: Route) => void;
  onDeleteRoute: (id: number) => void;
}

export function createRoutesColumns({ onEditRoute, onDeleteRoute }: RoutesColumnsProps): ColumnDef<Route>[] {
  return [
    {
      accessorKey: "origin",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Origin
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-forum">{row.getValue("origin")}</div>
      ),
    },
    {
      accessorKey: "destination",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Destination
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-forum">{row.getValue("destination")}</div>
      ),
    },
    {
      accessorKey: "estimated_duration_minutes",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-forum">{row.getValue("estimated_duration_minutes")} minutes</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const route = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditRoute(route)}
              className="text-persian-blue-600 hover:text-persian-blue-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteRoute(route.id)}
              className="text-error-600 hover:text-error-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}