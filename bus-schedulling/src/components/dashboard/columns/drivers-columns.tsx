"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Avatar from "boring-avatars";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Driver } from "../types";

interface DriversColumnsProps {
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: number) => void;
}

export function createDriversColumns({
  onEditDriver,
  onDeleteDriver,
}: DriversColumnsProps): ColumnDef<Driver>[] {
  return [
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditDriver(driver)}
              className="text-persian-blue-600 hover:text-persian-blue-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteDriver(driver.id)}
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
