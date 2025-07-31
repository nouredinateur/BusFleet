"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/avatar-wrapper";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Route } from "../types";
import { UserPermissions } from "@/lib/permissions";
import { GenericActionButtons } from "./generic-action-buttons";

interface RoutesColumnsProps {
  onEditRoute: (route: Route) => void;
  onDeleteRoute: (id: number) => void;
  permissions: UserPermissions;
}

export function createRoutesColumns({
  onEditRoute,
  onDeleteRoute,
  permissions,
}: RoutesColumnsProps): ColumnDef<Route>[] {
  const columns: ColumnDef<Route>[] = [
    {
      accessorKey: "origin",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Route
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const origin = row.getValue("origin") as string;
        const destination = row.getValue("destination") as string;
        const routeName = `${origin} → ${destination}`;
        return (
          <div className="flex items-center space-x-3">
            <Avatar
              name={routeName}
              size={40}
              variant="marble"
              colors={["#ff6b35", "#f7931e", "#ffd23f", "#06ffa5", "#1fb3d3"]}
              square
            />
            <div className="font-mono">{routeName}</div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true;
        const origin = row.getValue(id) as string;
        return origin === value;
      },
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
        <div className="font-mono">{row.getValue("destination")}</div>
      ),
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true;
        const destination = row.getValue(id) as string;
        return destination === value;
      },
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
        <div className="font-mono">
          {row.getValue("estimated_duration_minutes")} minutes
        </div>
      ),
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true;
        const duration = row.getValue(id) as number;

        switch (value) {
          case "under-30":
            return duration < 30;
          case "30-60":
            return duration >= 30 && duration <= 60;
          case "60-120":
            return duration > 60 && duration <= 120;
          case "over-120":
            return duration > 120;
          default:
            return true;
        }
      },
    },
  ];

  // Only add actions column if user has edit or delete permissions
  if (permissions.canEdit || permissions.canDelete) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const route = row.original;
        return (
          <GenericActionButtons
            item={route}
            onEdit={() => onEditRoute(route)}
            onDelete={() => onDeleteRoute(route.id)}
            permissions={permissions}
            deleteConfirmation={{
              title: "Delete Route",
              getDescription: () =>
                `Are you sure you want to delete this route? This action cannot be undone.`,
            }}
          />
        );
      },
    });
  }

  return columns;
}
