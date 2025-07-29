"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Avatar from "boring-avatars";
import { ArrowUpDown } from "lucide-react";
import { Driver } from "../types";
import { UserPermissions } from "@/lib/permissions";
import { GenericActionButtons } from "./generic-action-buttons";

interface DriversColumnsProps {
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: number) => void;
  permissions: UserPermissions;
}

export function createDriversColumns({
  onEditDriver,
  onDeleteDriver,
  permissions,
}: DriversColumnsProps): ColumnDef<Driver>[] {
  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Driver
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="flex items-center space-x-3">
            <Avatar
              name={name}
              size={40}
              variant="beam"
              colors={["#1e40af", "#0d9488", "#047857", "#f59e0b", "#ef4444"]}
            />
            <div className="font-mono">{name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "license_number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          License Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue("license_number")}</div>
      ),
    },
    {
      accessorKey: "available",
      header: "Status",
      cell: ({ row }) => {
        const available = row.getValue("available") as boolean;
        return (
          <Badge variant={available ? "success" : "secondary"}>
            {available ? "Available" : "Unavailable"}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        const available = row.getValue(id) as boolean;
        return value === "available" ? available : !available;
      },
    },
  ];

  // Only add actions column if user has edit or delete permissions
  if (permissions.canEdit || permissions.canDelete) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <GenericActionButtons
            item={driver}
            onEdit={onEditDriver}
            onDelete={onDeleteDriver}
            permissions={permissions}
            deleteConfirmation={{
              title: "Delete Driver",
              getDescription: (driver) => 
                `Are you sure you want to delete driver ${driver.name}? This action cannot be undone.`,
            }}
          />
        );
      },
    });
  }

  return columns;
}
