"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Avatar from "boring-avatars";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Bus } from "../types";

interface BusesColumnsProps {
  onEditBus: (bus: Bus) => void;
  onDeleteBus: (id: number) => void;
}

export function createBusesColumns({
  onEditBus,
  onDeleteBus,
}: BusesColumnsProps): ColumnDef<Bus>[] {
  return [
    {
      accessorKey: "plate_number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Bus
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const plateNumber = row.getValue("plate_number") as string;
        return (
          <div className="flex items-center space-x-3">
            <Avatar
              name={plateNumber}
              size={40}
              variant="beam"
              colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]}
              square
            />
            <div className="font-mono">{plateNumber}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Capacity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue("capacity")} passengers</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const bus = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditBus(bus)}
              className="text-persian-blue-600 hover:text-persian-blue-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteBus(bus.id)}
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
