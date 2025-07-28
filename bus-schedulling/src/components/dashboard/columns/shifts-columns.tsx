"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Avatar from "boring-avatars";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Shift } from "../types";

interface ShiftsColumnsProps {
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (id: number) => void;
}

export function createShiftsColumns({
  onEditShift,
  onDeleteShift,
}: ShiftsColumnsProps): ColumnDef<Shift>[] {
  return [
    {
      accessorKey: "shift_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("shift_date") as string;
        const time = row.getValue("shift_time") as string;
        const shift = ` ${row.getValue("id")} → ${date} → ${time}`;
        return (
          <div className="flex items-center space-x-3">
            <Avatar
              name={shift}
              size={40}
              variant="ring"
              colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]}
            />
            <div className="font-mono">{row.getValue("shift_date")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "shift_time",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-forum">{row.getValue("shift_time")}</div>
      ),
    },
    {
      accessorKey: "driver.name",
      header: "Driver",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="font-forum">{shift.driver?.name || "Unknown"}</div>
        );
      },
    },
    {
      accessorKey: "bus.plate_number",
      header: "Bus",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="font-forum">
            {shift.bus?.plate_number || "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="font-forum">
            {shift.route
              ? `${shift.route.origin} → ${shift.route.destination}`
              : "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "route.estimated_duration_minutes",
      header: "Duration",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="font-forum">
            {shift.route?.estimated_duration_minutes || 0} min
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditShift(shift)}
              className="text-persian-blue-600 hover:text-persian-blue-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteShift(shift.id)}
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
